// import axios from "axios";
// import React, { useState, useEffect } from "react";
// import { Link, useParams } from "react-router-dom/cjs/react-router-dom";

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

// function GroupComponent(props) {
//   const {id} =useParams();
//   console.log(id); 
//   const [groupId,setGroupId]=useState(null);
//   useEffect(()=>{
//     setGroupId(id)
//   },[id])
//   const [groups, setGroups] = useState([]);
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
//           gId: groupId,
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
//         axios.get(`http://localhost:4000/user/allusers?groupid=${groupId}`),
//         axios.get(`http://localhost:4000/user/getmessages?groupid=${groupId}`),
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
//   }, [groupId]);

//   const handleInputChange = (event) => {
//     setInputText(event.target.value);
//   };

//   useEffect(() => {
//     axios
//       .get(`http://localhost:4000/user/getgroups?userid=${decodedToken.userId}`)
//       .then((res) => {
//         console.log(res);
//         let grp = [];
//         grp = [...res.data.groups];
//         console.log(grp);
//         setGroups(grp);
//       })
//       .catch((e) => {
//         console.log(e);
//       });
//   }, [decodedToken.userId]);

//   function inviteHandler() {
//     const userId = prompt("Enter id of the user you wish to add!");
//     axios
//       .post(`http://localhost:4000/user/invite`, {
//         groupId,
//         userId,
//       })
//       .then((res) => {
//         alert(`User with id ${userId} added!`);
//         console.log(res);
//       })
//       .catch((e) => {
//         console.log(e);
//       });
//   }

//   return (
//     <div>
//       <h2>Chat Box</h2>
//       <button onClick={inviteHandler}>Add others to this group?</button>
//       <ul>
//         {groups.map((group) => (
//           <li key={group.id}>
//             <Link to={`/group/${group.id}`}>{group.name}</Link>
//           </li>
//         ))}
//       </ul>
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

// export default GroupComponent;

import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

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

function GroupComponent(props) {
  const { id } = useParams();
  const [groupId, setGroupId] = useState(null);
  const [groups, setGroups] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const decodedToken = parseJwt(localStorage.getItem("token"));

  useEffect(() => {
    setGroupId(id); // Update groupId state when URL params change
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputText.trim() !== "") {
      const messageToSend = `${decodedToken.name}: ${inputText}`;
      setMessages([...messages, messageToSend]);
      setInputText("");

      axios
        .post(`http://localhost:4000/user/sendmessage`, {
          id: decodedToken.userId,
          message: inputText,
          gId: groupId,
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
    if (groupId) { // Check if groupId is not null
        console.log("Useeffect has run")
      axios
        .all([
          axios.get(`http://localhost:4000/user/allusers?groupid=${groupId}`),
          axios.get(`http://localhost:4000/user/getmessages?groupid=${groupId}`),
        ])
        .then(
          axios.spread((usersRes, messagesRes) => {
            const userObj = {};
            usersRes.data.users.forEach((user) => {
              userObj[user.id] = user.name;
            });

            const newMessages = messagesRes.data.message.map(
              (msg) => `${userObj[msg.userId]}: ${msg.text}`
            );
            setMessages((prevMessages) => {
              const uniqueMessages = new Set([...prevMessages, ...newMessages]);
              return Array.from(uniqueMessages);
            });
          })
        )
        .catch((e) => console.log(e));
    }
  }, [groupId]);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/user/getgroups?userid=${decodedToken.userId}`)
      .then((res) => {
        console.log(res);
        let grp = [];
        grp = [...res.data.groups];
        console.log(grp);
        setGroups(grp);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [decodedToken.userId]);

  function inviteHandler() {
    const userId = prompt("Enter id of the user you wish to add!");
    axios
      .post(`http://localhost:4000/user/invite`, {
        groupId,
        userId,
      })
      .then((res) => {
        alert(`User with id ${userId} added!`);
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <div>
      <h2>Chat Box</h2>
      <button onClick={inviteHandler}>Add others to this group?</button>
      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            <Link to={`/group/${group.id}`}>{group.name}</Link>
          </li>
        ))}
      </ul>
      <div
        style={{
          maxHeight: "300px",
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
        <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default GroupComponent;
