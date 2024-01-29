import React, { useState } from 'react';
import './login.scss';

import { Room } from '../../helpers/room/Room';

const Login = ({ meet, setMeet, setUser }) => {
  const [ form, setForm ] = useState({
    email: 'aregchatalian@gmail.com',
    password: '1000dram',
    roomId: '123'
  });

  const onFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onJoinRoom = async () => {
    if (!form.email || !form.password || !form.roomId) return;

    const response = await fetch('https://localhost:3030/api/auth/sign-in', {
      method: 'POST',
      body: JSON.stringify({
        email: form.email,
        password: form.password
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.status !== 'OK') {
      alert(data.errors[0]?.msg || data.message);
      return;
    }

    if (meet.isOpen) return console.log('Already connected to a room');

    setMeet({ ...meet, room: new Room(form.roomId, data.data.id, setMeet) });

    setUser(data.data);
  }

  return (
    <div className="container">
      <div className="login">
        <input
          type="text"
          name="email"
          value={ form.email }
          className="user-input"
          autoComplete="off"
          placeholder="Email"
          onChange={ onFormChange }/>

        <input
          type="text"
          name="password"
          value={ form.password }
          className="user-input"
          autoComplete="off"
          placeholder="Password"
          onChange={ onFormChange }/>

        <input
          type="text"
          name="roomId"
          value={ form.roomId }
          className="room-input"
          autoComplete="off"
          placeholder="Room name"
          onChange={ onFormChange }/>

        <button onClick={ onJoinRoom }>
          <div><i className="fas fa-sign-in-alt"/></div>
        </button>
      </div>
    </div>
  );
}

export default Login;
