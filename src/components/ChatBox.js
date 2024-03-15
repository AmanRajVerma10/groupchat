// import axios from "axios";
// import React, { useState, useEffect } from "react";

// function parseJwt(token) {
//   var base64Url = token.split(".")[1];
//   var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//   var jsonPayload = decodeURIComponent(
//     window
//       .atob(base64)
//       .split("")
//       .map(function (c) {
//         return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
//       })
//       .join("")
//   );

//   return JSON.parse(jsonPayload);
// }

// function ChatBox() {
//   const [messages, setMessages] = useState([]);
//   const [inputText, setInputText] = useState("");
//   const decodedToken = parseJwt(localStorage.getItem("token"));

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     if (inputText.trim() !== "") {
//       const messageToSend = `${decodedToken.name}: ${inputText}`;
//       setMessages([...messages, messageToSend]);

//       setInputText("");

//       axios
//         .post(`http://localhost:4000/user/sendmessage`, {
//           id: decodedToken.userId,
//           message: inputText,
//         })
//         .then((response) => {
//           console.log(response);
//         })
//         .catch((e) => {
//           console.log(e);
//         });
//     }
//   };

//   useEffect(() => {
//     axios
//       .all([
//         axios.get(`http://localhost:4000/user/allusers`),
//         axios.get(`http://localhost:4000/user/getmessages`),
//       ])
//       .then(
//         axios.spread((usersRes, messagesRes) => {
//           const userObj = {};
//           usersRes.data.users.forEach((user) => {
//             userObj[user.id] = user.name;
//           });

//           const newMessages = messagesRes.data.message.map(
//             (msg) => `${userObj[msg.userId]}: ${msg.text}`
//           );
//           setMessages((prevMessages) => {
//             const uniqueMessages = new Set([...prevMessages, ...newMessages]);
//             return Array.from(uniqueMessages);
//           });
//         })
//       )
//       .catch((e) => console.log(e));
//   }, []);

//   const handleInputChange = (event) => {
//     setInputText(event.target.value);
//   };

//   return (
//     <div>
//       <h2>Chat Box</h2>
//       <div
//         style={{
//           maxHeight: "300px",
//           overflowY: "scroll",
//           border: "1px solid #ccc",
//           padding: "10px",
//         }}
//       >
//         {messages.map((message, index) => (
//           <div key={index}>{message}</div>
//         ))}
//       </div>
//       <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
//         <input type="text" value={inputText} onChange={handleInputChange} />
//         <button type="submit">Send</button>
//       </form>
//     </div>
//   );
// }

// export default ChatBox;

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

  const saveMessagesToLocal = (messages) => {
    const recentMessages = messages.slice(-10);
    localStorage.setItem("messages", JSON.stringify(recentMessages));
  };

  const getMessagesFromLocal = () => {
    const messages = localStorage.getItem("messages");
    return messages ? JSON.parse(messages) : [];
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputText.trim() !== "") {
      const messageToSend = `${decodedToken.name}: ${inputText}`;
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: messageToSend },
      ]);
      setInputText("");
      saveMessagesToLocal([
        ...messages,
        { id: messages.length + 1, text: messageToSend },
      ]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const localMessages = getMessagesFromLocal();
        const lastMessageId =
          localMessages.length > 0
            ? localMessages[localMessages.length - 1].id
            : 0;

        const [usersRes, messagesRes] = await axios.all([
          axios.get(`http://localhost:4000/user/allusers`),
          axios.get(
            `http://localhost:4000/user/getNewMessages?lastMessageId=${lastMessageId}`
          ),
        ]);

        const userObj = {};
        usersRes.data.users.forEach((user) => {
          userObj[user.id] = user.name;
        });

        const newMessages = messagesRes.data.messages.map((msg) => ({
          id: msg.id,
          text: `${userObj[msg.userId]}: ${msg.text}`,
        }));

        const updatedMessages = [...localMessages, ...newMessages];
        setMessages(updatedMessages);
        saveMessagesToLocal(updatedMessages);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
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
          <div key={index}>{message.text}</div>
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
