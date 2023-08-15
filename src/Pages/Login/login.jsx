import { useState } from 'react';
import {Cookies} from '../../Classes/Cookies/cookies'
import {Fetcher} from '../../Classes/Fetcher/fetcher'
import { Navigate } from 'react-router-dom';

import { userAtom } from '../../Atoms/useratom'
import { useAtom } from 'jotai'

const cookies = new Cookies();
const fetcher = new Fetcher();

const Login = ({updateAuthenticatedStatus}) =>{
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [redirectHome, setRedirectHome] = useState(false);
  const setUser = useAtom(userAtom)[1];

  const handleUsernameTyping = (e) =>{ setUsername(e.target.value); }
  const handlePasswordTyping = (e) =>{ setPassword(e.target.value); }

  const handleConnectionClick = () =>{
    const data = {identifier: username, password: password};

    fetcher.login(data).then(response=>{

      switch(response.state){
        case true:
          cookies.setCookie("logged", true);
          updateAuthenticatedStatus(true);
          setUser({id: response.data.user.id, username: response.data.user.username, isLogged: true});
          setRedirectHome(true);
        break;
        case false:
          cookies.setCookie("logged", false);
          setShowError(true);
        break;
      }
    })
  }

  if (cookies.getCookie("logged") === "true" ){
    return <Navigate to="/" />;
  }

  return (
    <div className='flexcol'>
      <h1>Se connecter</h1>
      {showError === true && <h3 className='red'>Erreur lors de la tentative de connexion au compte.</h3>}
      <input type = "username" placeholder='Votre pseudonyme' onChange={handleUsernameTyping}></input>
      <input type = "password" placeholder='Votre mot de passe' onChange={handlePasswordTyping}></input>
      <button type = "submit" onClick={handleConnectionClick}>Se connecter</button>
    </div>
  )
}

export default Login