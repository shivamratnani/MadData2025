import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
)

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dreams/:id" element={<DreamDetail />} />
      </Routes>
    </Router>
  )
}

// Create placeholder components for Home, Login, DreamDetail 