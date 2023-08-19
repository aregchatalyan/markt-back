import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHttp } from '../hooks/useHttp';

const SignIn = ({ setUser }) => {
  const { http } = useHttp();
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const onLogin = async () => {
    const response = await http('auth/sign-in', 'POST', {
      email: emailRef.current.value,
      password: passwordRef.current.value
    });

    if (response.data?.id) {
      setUser(response.data);
      setTimeout(() => navigate('/test'), 1000);
    }
  }

  return (
    <div className="form">
      <input type="text" name="email" placeholder="email" required ref={ emailRef }/>
      <input type="text" name="password" placeholder="password" required ref={ passwordRef }/>

      <button onClick={ onLogin }>Login</button>
    </div>
  );
}

export default SignIn;
