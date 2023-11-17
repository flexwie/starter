"use client";

import { deleteBlogPost } from "./actions";

export default function Post({id,title,content}:{id:string,title:string,content:string}){
  return (
        <div>
          <h3>{title}</h3>
          <p>{content}</p>
          <button onClick={async _ => {
            await deleteBlogPost(id)
          }}>delete</button>
          <hr />
        </div>
   
  )
}