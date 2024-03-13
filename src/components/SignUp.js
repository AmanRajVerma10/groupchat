import React from "react";

const SignUp=()=>{
    const signUpHandler=(e)=>{
        e.preventDefault();
        console.log("xyzzzzzzz");
    }

    return(
        <>
        <form>
            <input type="text" placeholder="Name"></input>
            <input type="email" placeholder="Email"></input>
            <input type="tel" placeholder="Phone"></input>
            <input type="password" placeholder="Password"></input>
            <button onClick={signUpHandler}>Sign Up</button>
        </form>
        
        </>
    )
}

export default SignUp;