import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { UserLogin } from './pages/User_Login/UserLogin'
import { AdminDashboard } from './pages/Admin_Dashboard/AdminDashboard'
import { AdminLogin } from './pages/Admin_Login/AdminLogin'
import { AdminRegister } from './pages/Admin_Login/AdminRegister'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="App">
      <Routes>
              <Route path="/login" element={<AdminLogin/>} />
              <Route path="/admin/register" element={<AdminRegister/>} />
              <Route path="/" element={<AdminDashboard/>} />
              {/* <Route path="/" element={<PrivateRoute element={Dashboard} />} /> */}
              
      </Routes>
      </div>
    </>
  )
}

export default App