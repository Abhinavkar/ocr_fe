import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import { UserLogin } from './pages/User_Login/UserLogin'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="App">
      <Routes>
              <Route path="/login" element={<UserLogin/>} />
              {/* <Route path="/" element={<PrivateRoute element={Dashboard} />} /> */}
              
      </Routes>
      </div>
    </>
  )
}

export default App