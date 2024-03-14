import { useRef } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const SignIn = () => {
  const history= useHistory();
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
        history.replace('/chat');
      })
      .catch((e) => {
        console.log(e);
        document.body.innerHTML += `<div style="color:red">${e.response.data.message}</div>`;
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
