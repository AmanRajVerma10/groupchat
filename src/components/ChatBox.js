import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";

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
  const [groups, setGroups] = useState([]);
  const decodedToken = parseJwt(localStorage.getItem("token"));

  const groupCreate = () => {
    const groupName = prompt("Enter group name!");
    console.log(groupName);
    axios
      .post(`http://localhost:4000/user/creategroup`, {
        name: groupName,
        adminId: decodedToken.userId,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  };

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

  return (
    <div>
      <h2>{`Welcome to your ChatBox, ${decodedToken.name}!`}</h2>
      <button onClick={groupCreate}>Create a group?</button>
      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            <Link to={`/group/${group.id}`}>{group.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatBox;
