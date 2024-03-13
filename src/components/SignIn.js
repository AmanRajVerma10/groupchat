import { useRef } from "react";
import axios from "axios";

const SignIn = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const loginHandler = () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    axios
      .post(`http://localhost:4000/user/login`, { email, password })
      .then(response=>{
        console.log(response);
        alert("Logged In!");
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <>
      <input type="email" ref={emailRef} placeholder="Email" required></input>
      <input
        type="password"
        ref={passwordRef}
        placeholder="Password"
        required
      ></input>
      <button onClick={loginHandler}>Login</button>
    </>
  );
};

export default SignIn;
