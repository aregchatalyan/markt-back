import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home, SignIn } from './components';

const App = () => {
  const [ user, setUser ] = useState({});
  const [ authenticated, setAuthenticated ] = useState(false);

  useEffect(() => {
    if (user.access_token) setAuthenticated(user.access_token);
  }, [ user ]);

  return (
    <Routes>
      <Route path="/" element={ <SignIn setUser={ setUser }/> }/>

      { authenticated &&
        <Route path="/test" element={ <Home user={ user }/> }/>
      }
    </Routes>
  );
}

export default App;