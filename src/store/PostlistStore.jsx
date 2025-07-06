// import React, { createContext, useReducer } from 'react'


 
//  export const PostList= createContext({
//   postList:[],
//   addPost:()=>{},
//   deletePost:()=>{
    
//   },

// })
// const postListReducer=(currPostlist,action)=>{
//   let newPostList=currPostlist;
//   // if (action.type === 'DEFAULT_POST') {
//   //   newPostList=currPostlist.filter(post => post.id !== action.payload.postId)
//   // }
//   if (action.type === "DELETE_POST") {
//     newPostList = currPostlist.filter(post => post.id !== action.payload.postId);
//   }else if(action.type === "ADD_POST"){
//     newPostList=[action.payload , ...currPostlist];
//   }

//   return newPostList;
// }

// const PostListProvider = ({children}) => {
//   const [postList,dispatchPostList]=useReducer( postListReducer
//     ,  DEFAULT_POST_LIST
//   );
//   const addPost=(userId,postTitle,postBody,reactions,tags)=>{
//     console.log(`${userId} ${postTitle} ${postBody} ${reactions} ${tags}`);
//     console.log("✅ addPost function called!");
//     dispatchPostList({
//       type:"ADD-POST",
//       payload:{
//         id: Date.now(),
//         title:postTitle,
//         body :postBody,
//         reaction:reactions,
//         user_id:userId,
//         tags:tags,
//       }
       
      
//     })
//   }


//   const deletePost=(postId)=>{
//     console.log(postId);
    
//     dispatchPostList({
//       type:"DELETE_POST",
//       payload:{
//        postId ,
//       }
//     } )
//   }
//   // const [postList,dispatchPostList]=useReducer(postListReducer,DEFAULT_POST_LIST)
//   return (
//    <>
//    <PostList.Provider 
//    value={{postList,addPost,deletePost}}
//    >
//     {children}
//    </PostList.Provider>
//    </>
//   )
// }



// const DEFAULT_POST_LIST =[
//   {
//     id:"1",
//     title:"Going To FarmHouse",
//     body :"Hi Friends, I am going to FarmHouse For my Vacation",
//     reaction:"2",
//     user_id:"User-1",
//     tags:["Vacation"],
//   },
//   {
//     id:"2",
//     title:"Going To SeaSide",
//     body :"Hi Friends, I am going to SeaSide For my Friends",
//     reaction:"4",
//     user_id:"User-3",
//     tags:["SeaSide",]
//   }
// ]

// export default PostListProvider





import React, { createContext, useReducer } from 'react';

export const PostList = createContext();

const DEFAULT_POST_LIST = [
  {
    id: "1",
    title: "Going To FarmHouse",
    body: "Hi Friends, I am going to FarmHouse For my Vacation",
    reaction: "2",
    user_id: "User-1",
    tags: ["Vacation"],
  },
  {
    id: "2",
    title: "Going To SeaSide",
    body: "Hi Friends, I am going to SeaSide For my Friends",
    reaction: "4",
    user_id: "User-3",
    tags: ["SeaSide"],
  }
];

const postListReducer = (currPostlist, action) => {
  switch (action.type) {
    case 'ADD_POST':
      console.log("🚀 Adding post to reducer:", action.payload);
      return [action.payload, ...currPostlist];

    case 'DELETE_POST':
      return currPostlist.filter(post => post.id !== action.payload.postId);

    default:
      return currPostlist;
  }
};

const PostListProvider = ({ children }) => {
  const [postList, dispatchPostList] = useReducer(postListReducer, DEFAULT_POST_LIST);

  const addPost = (userId, postTitle, postBody, reactions, tags) => {
    dispatchPostList({
      type: "ADD_POST",
      payload: {
        id: Date.now(),
        title: postTitle,
        body: postBody,
        reaction: reactions,
        user_id: userId,
        tags: tags,
      }
    });
  };

  const deletePost = (postId) => {
    dispatchPostList({
      type: "DELETE_POST",
      payload: { postId }
    });
  };

  return (
    <PostList.Provider value={{ postList, addPost, deletePost }}>
      {children}
    </PostList.Provider>
  );
};

export default PostListProvider;
