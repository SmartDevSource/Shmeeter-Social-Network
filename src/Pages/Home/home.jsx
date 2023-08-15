import {Cookies} from '../../Classes/Cookies/cookies'
import {Fetcher} from '../../Classes/Fetcher/fetcher'

import {userAtom} from '../../Atoms/useratom'
import { useAtom } from 'jotai'

import Like from '../../Components/Like/like'

import { useEffect, useState } from 'react';

const cookies = new Cookies();
const fetcher = new Fetcher();

const Home = () =>{
  const [user] = useAtom(userAtom);
  const [postContent, setPostContent] = useState('');
  const [showCreate, setCreate] = useState(false);
  const [error, setError] = useState('');
  const [posts, setPosts] = useState([]);
  const [refreshPosts, setRefreshPosts] = useState(false);

  const loadPosts = () =>{
    fetcher.getPosts().then(response => {
      const data = response.data.data;
  
      const fetchUserPromises = data.map(post =>
        fetcher.getPost(post.id).then(resp => resp.data.data.attributes.user)
      );
  
      Promise.all(fetchUserPromises).then(users => {
        const postsWithUsers = data.map((post, index) => ({
          ...post,
          user: users[index]
        }));
        setPosts(postsWithUsers);
        setRefreshPosts(false);
      });
    });
  }

  const handleClickCreate = () =>{
    setCreate(true);
  }

  const handlePostTyping = (e) =>{
    setPostContent(e.target.value);
  }

  const handleClickCancel = () =>{
    setCreate(false);
  }

  const handleClickPublish = () =>{
    const data = { data: {text: postContent, user: user.id}};
    postContent.length>0 ? 
    fetcher.createPost(data).then(response=>{
      if (response.state === true){
        setRefreshPosts(true);
        setCreate(false);
      }
    })
      :  
    setError("[ERREUR] Votre texte ne doit pas être vide.");
  }

  const handleClickDeletePost = (postId) =>{
    fetcher.deletePost(postId).then(resp=> {
      if (resp.state===true){
        loadPosts();
      }
    })
  }

  const handleLikeUpdate = ()=>{ 
    setRefreshPosts(true);
    loadPosts(); 
  }

  useEffect(() => { loadPosts(); }, []);
  useEffect(() => { loadPosts(); }, [refreshPosts]);

  useEffect(()=>{
    for(let i = 0 ; i < posts.length ; i++){
      fetcher.getPost(posts[i].id).then(resp=>{
        posts[i] = {...posts[i], user: resp.data.data.attributes.user};
      })
    }
    setPosts(posts);
  }, [posts])

  return (
    <div className='flexcol'>
      {user.username !== undefined && user.isLogged ? (
        <>
          <h1 className='border'>Salut {user.username}</h1>
          {!showCreate ? (
            <button className='fz20' type='submit' onClick={handleClickCreate}>
              Créer un post
            </button> 
          ) : (
            <>
              {error.length>0 && <h3 className='red'>{error}</h3>}
              <textarea aria-setsize='400' placeholder='Ton contenu...' onChange={handlePostTyping} value = {postContent}></textarea>
              <button className='fz20' onClick={handleClickPublish}>Publier</button>
              <button className='fz20' onClick={handleClickCancel}>Annuler</button>
            </>
          )}
        </>
      ) : (
        <h3>Bienvenue à toi cher visiteur</h3>
      )}
      {posts.map(post=>(
        <div key = {post.id} className='post'>
          <p>Auteur : <b>{post.user.data.attributes.username}</b></p>
          {post.attributes.modified && <p>(modifié)</p>}
          <p>{post.attributes.text}</p>

            <p>
              Likes : {post.attributes.like} 
              {user.isLogged && 
                <Like className = "inversedcolors" postId = {post.id} onLikeUpdate={handleLikeUpdate}/>
              }
            </p>

          {(user.username === post.user.data.attributes.username && user.isLogged) && 
            <>
              <button onClick={()=>handleClickDeletePost(post.id)}>Supprimer ce post</button>
            </>
          }
        </div>
      ))}
    </div>
  );
}

export default Home