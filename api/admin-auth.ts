import { createHmac, timingSafeEqual } from "node:crypto";
import { createHash } from "node:crypto";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, publicQuery } from "./middleware";
import { getAdminKeyHash, setAdminKeyHash } from "./queries/askme";

/**
 * 管理后台独立密钥登录（不使用 Kimi OAuth）。
 * 密钥仅存 SHA-256 哈希；登录成功后签发 7 天有效的 HMAC token，
 * token 的签名密钥派生自当前密钥哈希 —— 修改密钥后旧 token 全部失效。
 */

// 首次部署的默认密钥，登录后请立即在后台「修改密钥」
export const DEFAULT_ADMIN_KEY = "lzy-admin-2026";

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function sha256(s: string) {
  return createHash("sha256").update(s).digest("hex");
}

async function ensureKeyHash(): Promise<string> {
  let hash = await getAdminKeyHash();
  if (!hash) {
    hash = sha256(DEFAULT_ADMIN_KEY);
    await setAdminKeyHash(hash);
  }
  return hash;
}

function sign(payload: string, keyHash: string) {
  return createHmac("sha256", `lzy-admin:${keyHash}`).update(payload).digest("hex");
}

function safeEq(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

async function issueToken(): Promise<{ token: string; expiresAt: number }> {
  const hash = await ensureKeyHash();
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const payload = String(expiresAt);
  return { token: `${payload}.${sign(payload, hash)}`, expiresAt };
}

async function tokenValid(token: string): Promise<boolean> {
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expiry = Number(payload);
  if (!Number.isFinite(expiry) || expiry < Date.now()) return false;
  const hash = await ensureKeyHash();
  return safeEq(sign(payload, hash), sig);
}

/** 在管理端 procedure 开头调用，token 无效则抛 401 */
export async function assertAdminToken(token: string) {
  if (!(await tokenValid(token))) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "管理密钥无效或已过期" });
  }
}

export const adminAuthRouter = createRouter({
  // 密钥登录 → 签发 token
  login: publicQuery
    .input(z.object({ key: z.string().min(1).max(128) }))
    .mutation(async ({ input }) => {
      const hash = await ensureKeyHash();
      if (!safeEq(sha256(input.key), hash)) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "密钥不正确" });
      }
      return issueToken();
    }),

  // 校验本地 token 是否仍有效
  verify: publicQuery
    .input(z.object({ token: z.string().min(1) }))
    .query(async ({ input }) => ({ ok: await tokenValid(input.token) })),

  // 修改密钥（旧 token 即刻失效，返回新 token）
  changeKey: publicQuery
    .input(
      z.object({
        token: z.string().min(1),
        newKey: z.string().min(8, "新密钥至少 8 位").max(128),
      }),
    )
    .mutation(async ({ input }) => {
      await assertAdminToken(input.token);
      await setAdminKeyHash(sha256(input.newKey));
      return issueToken();
    }),
});
