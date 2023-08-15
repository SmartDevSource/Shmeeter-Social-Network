import { Cookies } from '../Cookies/cookies'

export class Fetcher{
  constructor(){
    this.cookies = new Cookies();
  }

  register = async (data) =>{
    try{
    const response = await fetch('http://localhost:1337/api/auth/local/register', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
      });
    
      if(response.ok){
        const dataResponse = await response.json();
        this.cookies.setCookie("token", dataResponse.jwt);
        this.cookies.setCookie("username", data.username);
        this.cookies.setCookie("password", data.password);
        return {state: true, data :dataResponse};
      } else {
        console.log("Echec de l'enregistrement.");
        return {state: false, data :[]};
      }
    }catch(error){
      console.log("Erreur : "+error);
      return {state: false, data :[]};
    }
  }

  login = async (data) => {
      try {
        const response = await fetch('http://localhost:1337/api/auth/local', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
          });
  
        if (response.ok) {
          const dataResponse = await response.json();
          this.cookies.setCookie("token", dataResponse.jwt);
          this.cookies.setCookie("username", data.identifier);
          this.cookies.setCookie("password", data.password);
          return {state: true, data :dataResponse};

        } else {
          console.log("Échec de récupération des données utilisateur.");
          return {state: false, data :[]};
        }
      } catch (error) {
        console.log("Erreur : " + error);
        return {state: false, data :[]};
      }
  };

  updateProfile = async (data, userid) => {
    try {
      const token = this.cookies.getCookie("token");
      const response = await fetch(`http://localhost:1337/api/users/${userid}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data)
        });

      if (response.ok) {
        const dataResponse = await response.json();
        this.cookies.setCookie("username", data.username);
        return {state: true, data :dataResponse};

      } else {
        console.log("Échec de la modification du profil");
        return {state: false, data :[]};
      }
    } catch (error) {
      console.log("Erreur : " + error);
      return {state: false, data :[]};
    }
  };

  createPost = async (data) => {
    try {
      const token = this.cookies.getCookie("token");
      const response = await fetch(`http://localhost:1337/api/posts`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data)
        });

      if (response.ok) {
        const dataResponse = await response.json();
        return {state: true, data :dataResponse};

      } else {
        console.log("Échec de la publication du post.");
        return {state: false, data :[]};
      }
    } catch (error) {
      console.log("Erreur : " + error);
      return {state: false, data :[]};
    }
  };

  updatePost = async (postId, postContent) => {
    const dataContent = {data: postContent}
    try {
      const token = this.cookies.getCookie("token");
      const response = await fetch(`http://localhost:1337/api/posts/${postId}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataContent)
        });

      if (response.ok) {
        const dataResponse = await response.json();
        return {state: true, data :dataResponse};

      } else {
        console.log("Échec de la modification du post.");
        return {state: false, data :[]};
      }
    } catch (error) {
      console.log("Erreur : " + error);
      return {state: false, data :[]};
    }
  };

  getPosts = async () =>{
    try {
      const response = await fetch(`http://localhost:1337/api/posts`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
        });

      if (response.ok) {
        const dataResponse = await response.json();
        return {state: true, data :dataResponse};

      } else {
        console.log("Échec de la récupération des posts.");
        return {state: false, data :[]};
      }
    } catch (error) {
      console.log("Erreur : " + error);
      return {state: false, data :[]};
    }
  }

  getPost = async (postId) =>{
    const token = this.cookies.getCookie("token");
    try {
      const response = await fetch(`http://localhost:1337/api/posts/${postId}?populate=*`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        });

      if (response.ok) {
        const dataResponse = await response.json();
        return {state: true, data :dataResponse};

      } else {
        console.log("Échec de la récupération du post.");
        return {state: false, data :[]};
      }
    } catch (error) {
      console.log("Erreur : " + error);
      return {state: false, data :[]};
    }
  }

  deletePost = async (postId) => {
    try {
      const token = this.cookies.getCookie("token");
      const response = await fetch(`http://localhost:1337/api/posts/${postId}`, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        });

      if (response.ok) {
        const dataResponse = await response.json();
        return {state: true, data :dataResponse};

      } else {
        console.log("Échec de la suppression du post.");
        return {state: false, data :[]};
      }
    } catch (error) {
      console.log("Erreur : " + error);
      return {state: false, data :[]};
    }
  };

  updateLike = async (postId, userId) => {
    this.getPost(postId).then(resp=>{

      const dataLikes = resp.data.data.attributes.users_likes.data;
      const likeIndex = dataLikes.findIndex((like)=>like.id === userId);
      
      if (likeIndex!=-1){
        dataLikes.splice(likeIndex, 1);
      } else {
        dataLikes.push(userId.toString());
      }

      const dataLikesToSend = {
        "data":{
          "like": dataLikes.length,
          "users_likes": dataLikes
        }
      }

      const token = this.cookies.getCookie("token");
      try {
        fetch(`http://localhost:1337/api/posts/${postId}?populate=*`, {
          method: 'put',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(dataLikesToSend)
          });

      } catch (error) {
        console.log("Erreur : " + error);
        return {state: false, data :[]};
      }
      
    })
  }

  getLike = async(postId) =>{
    const token = this.cookies.getCookie("token");
    try {
      const response = await fetch(`http://localhost:1337/api/posts/${postId}?populate=*`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        });

      if (response.ok) {
        const dataResponse = await response.json();
        return {state: true, data: dataResponse.data.attributes.users_likes.data};

      } else {
        console.log("Échec de la récupération du post.");
        return {state: false, data :[]};
      }
    } catch (error) {
      console.log("Erreur : " + error);
      return {state: false, data :[]};
    }
  }

}