import { Link } from "react-router-dom/cjs/react-router-dom.min";

const MainNavigation=(props)=>{
    return(<>
    <Link to="/login">Login</Link>
    <Link to="/sign-up">Sign Up</Link>
    <Link to='/chat'>Chat</Link>
    </>)
}

export default MainNavigation;