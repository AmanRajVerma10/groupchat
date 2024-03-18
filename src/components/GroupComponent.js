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
  const [isAdmin, setIsAdmin]=useState(false);
  const decodedToken = parseJwt(localStorage.getItem("token"));

  useEffect(() => {
    setGroupId(id); 
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
    if (groupId) {
      setMessages([]);
      axios.post(`http://localhost:4000/user/isadmin`,{
        groupId,
        userId:decodedToken.userId
      }).then(res=>{setIsAdmin(res.data.message)}).catch(e=>{console.log(e)})
      axios
        .all([
          axios.get(`http://localhost:4000/user/allusers?groupid=${groupId}`),
          axios.get(
            `http://localhost:4000/user/getmessages?groupid=${groupId}`
          ),
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
  }, [groupId,decodedToken.userId]);

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

  function removeHandler() {
    const userId = prompt("id of the user, you wish to remove!");
    axios
      .post(`http://localhost:4000/user/remove`, {
        userId,
        groupId,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function adminHandler() {
    const userId = prompt("id of the user you want to make admin");
    axios
      .post(`http://localhost:4000/user/makeadmin`, {
        userId,
        groupId,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <div>
      <h2>Chat Box</h2>
      {isAdmin && <h3>Admin Features</h3>}
     {isAdmin && <button onClick={inviteHandler}>Add others to this group?</button>}
      <br></br>
      {isAdmin && <button onClick={removeHandler}>Remove someone from this group?</button>}
      {isAdmin && <button onClick={adminHandler}>Make another user admin?</button>}
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
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default GroupComponent;
