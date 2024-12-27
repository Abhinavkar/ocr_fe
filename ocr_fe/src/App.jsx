import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { UserLogin } from './pages/User_Login/UserLogin'
import { AdminDashboard } from './pages/Admin_Dashboard/AdminDashboard'
import { AdminLogin } from './pages/Admin_Login/AdminLogin'
import { AdminRegister } from './pages/Admin_Login/AdminRegister'
import { UserRegister } from './pages/User_Login/UserRegister'
import { Result } from './pages/Result/Result'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="App">
      <Routes>
              <Route path="/" element={<AdminLogin/>} />
              <Route path="/admin/register" element={<AdminRegister/>} />
              <Route path="/user/login" element={<UserLogin/>} />
              <Route path="/user/register" element={<UserRegister/>} />
              <Route path="/dashboard" element={<AdminDashboard/>} />
              <Route path='/result' element={<Result/>}/>
              {/* <Route path="/" element={<PrivateRoute element={Dashboard} />} /> */}

              
      </Routes>
      </div>
    </>
  )
}

export default App