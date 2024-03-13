import React, { useEffect, useState } from "react";
import axios from "axios";

const SignUp = () => {
  const [userDetails, setUserDetails] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    setUserDetails((prevUserDetails) => ({
      ...prevUserDetails,
      name,
      email,
      phone,
      password,
    }));
  };

  useEffect(() => {
    if (Object.keys(userDetails).length !== 0) {
      const signUp = () => {
        axios
          .post("http://localhost:4000/user/signup", userDetails)
          .then((response) => {
            console.log(response);
            alert(response.data.message);
          })
          .catch((e) => {
            document.body.innerHTML += `<div style="color:red">${e.response.data.error}</div>`;
          });
      };
      signUp();
    }
  }, [userDetails]);

  return (
    <>
      <form>
        <input
          type="text"
          placeholder="Name"
          required
          onChange={(e) => {
            setName(e.target.value);
          }}
        ></input>
        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        ></input>
        <input
          type="tel"
          placeholder="Phone"
          required
          onChange={(e) => {
            setPhone(e.target.value);
          }}
        ></input>
        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></input>
        <button onClick={submitHandler}>Sign Up</button>
      </form>
    </>
  );
};

export default SignUp;
