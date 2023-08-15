export class Cookies{

  getCookie(cookieName){
    const cookies = document.cookie;
    const cookiesArray = cookies.split("; ");

    for(const cookie of cookiesArray){
      const [name, value] = cookie.split("=");
      if (name === cookieName){
        return value;
      }
    }

    return null;
  }

  setCookie(cookieName, value){
    document.cookie = `${cookieName}=${value}; samesite=lax`;
  }
}