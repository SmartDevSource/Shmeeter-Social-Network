import { Fetcher } from "../../Classes/Fetcher/fetcher";

import {userAtom} from '../../Atoms/useratom'
import { useAtom } from 'jotai'
import { useState } from "react";

const fetcher = new Fetcher();

const Like = ({postId, onLikeUpdate}) =>{
  const [user] = useAtom(userAtom);
  const [isLiked, setIsLiked] = useState(false);

  fetcher.getLike(postId).then(resp=>{
    const isAlreadyLiked = resp.data.some((like)=>like.id==user.id.toString());
    setIsLiked(!isAlreadyLiked);
  })

  const handleClickLike = ()=>{
    fetcher.updateLike(postId, user.id).then(()=>{
     onLikeUpdate();
    })
  }

  return (
    <button type = "post" onClick={handleClickLike}> {isLiked ? "J'aime" : "Je n'aime plus"}</button>
  )
}

export default Like;