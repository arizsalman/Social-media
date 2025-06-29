import React, { createContext, useReducer } from 'react'


 
 export const PostList=createContext({
  postList:[],
  addPost:()=>{},
  deletePost:()=>{
    
  },

})
const postListReducer=(currPostlist,action)=>{
  let newPostList=currPostlist;
  // if (action.type === 'DEFAULT_POST') {
  //   newPostList=currPostlist.filter(post => post.id !== action.payload.postId)
  // }
  if (action.type === 'DELETE_POST') {
    newPostList = currPostlist.filter(post => post.id !== action.payload.postId);
  }
  return newPostList;
}

const PostListProvider = ({children}) => {
  const [postList,dispatchPostList]=useReducer(
    postListReducer
    ,DEFAULT_POST_LIST
  );
  const addPost=()=>{}
  const deletePost=(postId)=>{
    console.log(postId);
    
    dispatchPostList({
      type:"DELETE_POST",
      payload:{
       postId
      }
    })
  }
  // const [postList,dispatchPostList]=useReducer(postListReducer,DEFAULT_POST_LIST)
  return (
   <>
   <PostList.Provider 
   value={{postList,addPost,deletePost}}
   >
    {children}
   </PostList.Provider>
   </>
  )
}



const DEFAULT_POST_LIST =[
  {
    id:"1",
    title:"Going To FarmHouse",
    body :"Hi Friends, I am going to FarmHouse For my Vacation",
    reaction:"2",
    user_id:"User-1",
    tags:["Vacation"],
  },
  {
    id:"2",
    title:"Going To SeaSide",
    body :"Hi Friends, I am going to SeaSide For my Friends",
    reaction:"4",
    user_id:"User-3",
    tags:["SeaSide",]
  }
]

export default PostListProvider
