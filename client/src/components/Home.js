import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHttp } from '../hooks/useHttp';

const Home = ({ user }) => {
  const navigate = useNavigate();
  const { http, loading, redirectTo } = useHttp();
  const [ count, setCount ] = useState(0);
  const [ test, setTest ] = useState(false);

  const apiTest = useCallback(async () => {
    await http('auth/test', 'POST', null, {
      Authorization: `Bearer ${ localStorage.getItem('access_token') }`
    });

    setCount(prev => prev + 1);
  }, [ http ]);

  useEffect(() => {
    let timer;

    if (test) {
      timer = setInterval(async () => await apiTest(), 1000);
    }

    if (redirectTo) clearInterval(timer);
    return () => clearInterval(timer);
  }, [ test, apiTest, redirectTo ]);

  useEffect(() => {
    if (redirectTo) navigate('/');
  }, [ redirectTo, navigate ]);

  useEffect(() => {
    if (!user.id) navigate('/');
  }, [ user, navigate ]);

  return (
    <div className="app">
      <button onClick={ () => setTest(prev => !prev) }>Test</button>

      <h1>{ count }</h1>

      { loading && <h2 style={ { position: 'absolute', right: '50%', top: 0 } }>Loading...</h2> }

      <pre style={ { width: '500px' } }>
        { JSON.stringify(user, null, 2) }
      </pre>
    </div>
  );
}

export default Home;
