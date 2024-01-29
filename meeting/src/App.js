import React, { useState } from 'react';
import { Hall, Login } from './pages';
import { Control } from './components';

const App = () => {
  const [ user, setUser ] = useState({});

  const [ meet, setMeet ] = useState({
    room: {},
    local: [],
    remote: [],
    isOpen: false
  });

  return (
    <div>
      { !user.accessToken
        ? (<Login meet={ meet } setMeet={ setMeet } setUser={ setUser }/>)
        : (<>
            <Control meet={ meet } user={ user } setUser={ setUser }/>
            <Hall meet={ meet }/>
          </>
        ) }
    </div>
  );
}

export default App;
