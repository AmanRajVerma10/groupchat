import axios from "axios";
import React, { useState, useEffect } from "react";

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const decodedToken = parseJwt(localStorage.getItem("token"));

  useEffect(() => {
    axios
      .get(`http://localhost:4000/user/getmessages`)
      .then((response) => {
        const newMessages = response.data.message.map((msg) => msg.text);
        setMessages((prevMessages) => [...prevMessages, ...newMessages]);
  })
      .catch((e) => console.log(e));
  }, []);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputText.trim() !== "") {
      setMessages([...messages, inputText]);
      setInputText("");
      axios
        .post(`http://localhost:4000/user/sendmessage`, {
          id: decodedToken.userId,
          message: inputText,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <div>
      <h2>Chat Box</h2>
      <div
        style={{
          maxHeight: "300px",
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        {messages.map((message, index) => (
          <div key={index}>
            {decodedToken.name}: {message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
        <input type="text" value={inputText} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatBox;
