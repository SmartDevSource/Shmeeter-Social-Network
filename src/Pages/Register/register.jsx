import { useEffect, useState } from 'react';
import {Cookies} from '../../Classes/Cookies/cookies'
import {Fetcher} from '../../Classes/Fetcher/fetcher'
import { Navigate } from 'react-router-dom';

const cookies = new Cookies();
const fetcher = new Fetcher();

const Register = () =>{
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

  const handleUsernameTyping = (e) =>{ setUsername(e.target.value); }
  const handleEmailTyping = (e) =>{ setEmail(e.target.value); }
  const handlePasswordTyping = (e) =>{ setPassword(e.target.value); }

  const handleCreateAccountClick = () =>{
    const data = {username: username, email: email, password: password};

    fetcher.register(data).then(response=>{

      switch(response.state){
        case true:
          cookies.setCookie("logged", true);
          setShowError(false);
          setAccountCreated(true);
        break;
        case false:
          cookies.setCookie("logged", false);
          setShowError(true);
        break;
      }
    })
  }

  return (
    <div className='flexcol'>
      {accountCreated && <Navigate to = '/'/>}
      <h1>Créer un compte</h1>
      {showError === true && <h3 className='red'>Erreur lors de la création du compte.</h3>}
      <input type = "text" placeholder='Votre pseudonyme' onChange={handleUsernameTyping}></input>
      <input type = "email" placeholder='Votre adresse email' onChange={handleEmailTyping}></input>
      <input type = "password" placeholder='Votre mot de passe' onChange={handlePasswordTyping}></input>
      <button type = "submit" onClick={handleCreateAccountClick}>Créer</button>
    </div>
  )
}

export default Register