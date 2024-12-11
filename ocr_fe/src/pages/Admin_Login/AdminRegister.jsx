import "./AdminLogin.css"
import AdminLogo from "../../assets/images/blacklogo.png"
export const AdminRegister = () => {
    const AdminRegister=()=>{
        
        return 
    }
  return (
    <div className="login-container">
        <img src={AdminLogo} className="LoginLogoImage" alt="" />
        <h2>Admin Registertion</h2>
        <form onSubmit={AdminRegister}>
            <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" required />
            </div>
            <div className="form-group" >
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required />
            </div>
            <button type="submit" >Login</button>
        </form>
    </div>
  )
}
