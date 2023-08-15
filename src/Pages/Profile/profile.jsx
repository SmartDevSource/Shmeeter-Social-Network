import { useState } from 'react';
import {Cookies} from '../../Classes/Cookies/cookies'
import {Fetcher} from '../../Classes/Fetcher/fetcher'

import {userAtom} from '../../Atoms/useratom'
import { useAtom } from 'jotai';

import { Navigate } from 'react-router-dom';

const cookies = new Cookies();
const fetcher = new Fetcher();

const Profile = () =>{
  const [newUsername, setNewUsername] = useState('');
  const [description, setDescription] = useState('');
  const [user] = useAtom(userAtom);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleNewUsernameTyping = (e) => { setNewUsername(e.target.value)}
  const handleDescriptionTyping = (e) => { setDescription(e.target.value)}

  const handleClickUpdateProfile = () =>{
    const data = {username: newUsername, description: description}
    fetcher.updateProfile(data, user.id).then(()=>{
      user.username = newUsername;
      setUpdateSuccess(true);
    })
  }

  if (user.isLogged!==true){
    return <Navigate to = "/login"/>;
  }

  return (
    <>
    <div className='flexcol'>
      <h2>Alors {user.username}, que veux-tu modifier ?</h2>
      {updateSuccess && <h3 className='green'>Modifications apportées avec succès !</h3> }
      <h3>Voici ta description :</h3>
      <p>{user.description}</p>
      <input type = "text" placeholder='Modifier mon pseudonyme' onChange={handleNewUsernameTyping}></input>
      <input type = "text" placeholder='Mettre à jour ma description'onChange={handleDescriptionTyping}></input>
      <button type = "submit" onClick={handleClickUpdateProfile}>Mettre à jour</button>
    </div>
    </>
  )
}

export default Profile