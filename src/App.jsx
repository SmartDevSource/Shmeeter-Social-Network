import {Cookies} from './Classes/Cookies/cookies'
import {Fetcher} from './Classes/Fetcher/fetcher'

import './App.css'
import {BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import Home from './Pages/Home/home'
import Login from './Pages/Login/login'
import Register from './Pages/Register/register'
import Profile from './Pages/Profile/profile'

import { userAtom } from './Atoms/useratom'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { useEffect } from 'react'

const cookies = new Cookies();
const fetcher = new Fetcher();

function App() {
  const [authentificated, setAuthentification] = useState(false);
  const user = useAtom(userAtom);
  const setUser = useAtom(userAtom)[1];

  // cookies.setCookie("logged", false);

  const handleDisconnection = () =>{
    cookies.setCookie("logged", false);
    setUser((prev)=>({...prev, isLogged: false}))
    setAuthentification(false);
  }

  const updateAuthenticatedStatus = (status) =>{
    setAuthentification(status);
  }

  useEffect(()=>{
    const isLogged = cookies.getCookie("logged");

    switch(isLogged){
      case "true": {

        const data = {identifier: cookies.getCookie("username"), password: cookies.getCookie("password")};

        fetcher.login(data).then(response=>{
          switch(response.state){
            case true : {
              setUser({id : response.data.user.id, username: response.data.user.username, description: response.data.user.description, isLogged: true})
              setAuthentification(true);
              break;
            }
            case false : {
              setAuthentification(false);
            break;
            }
          }
        })
        }
        break;
      case "false":
        setAuthentification(false);
        break;
    }
  },[])

  useEffect(()=>{
    setAuthentification(authentificated);
  }, [authentificated])

  return (
    <>
    <BrowserRouter>
    <div className='flexrow navbar'>
      <Link to = "/">Accueil</Link>
      
      {!authentificated ? (
      <>
        <Link to = "/login">Se connecter</Link>
        <Link to = "/register">Créer un compte</Link>
      </>
      ) : ( 
      <>
        <Link to = "/profile">Mon profil</Link>
        <button className='fz20' type = "submit" onClick={handleDisconnection}>Se déconnecter</button>
      </>
      )
      }
    </div>
    <Routes>
      <Route path = "/" element = {<Home authentificated = {authentificated}/>}/>
      <Route path = "/login" element = {<Login updateAuthenticatedStatus = {updateAuthenticatedStatus}/>}/>
      <Route path = "/register" element = {<Register/>}/>
      <Route path = "/profile" element = {<Profile/>}/>
    </Routes>

    </BrowserRouter>

    <div className='flexcol'>

    </div>
    </>
  )
}

export default App