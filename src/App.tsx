import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Cases from './pages/Cases'
import CaseDetail from './pages/CaseDetail'
import Experience from './pages/Experience'
import AskMe from './pages/AskMe'
import Admin from './pages/Admin'
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cases" element={<Cases />} />
      <Route path="/cases/:id" element={<CaseDetail />} />
      <Route path="/experience" element={<Experience />} />
      <Route path="/askme" element={<AskMe />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
