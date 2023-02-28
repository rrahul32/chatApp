import React, {useState} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Home from './src/screens/auth/Home';
import Login from './src/screens/Login';

const App = () => {
  const [loginStatus, setLoginStatus] = useState(true);
  function handleLogin(){
    setLoginStatus(true);
  }
  return (
   loginStatus?<Home />: <Login onLoggedIn={handleLogin} />
  )
}

export default App