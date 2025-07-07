
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
        id: Date.now().toString(), // ✅ string id to match existing posts
        title: postTitle,
        body: postBody,
        reaction: reactions,
        user_id: userId,
        tags: tags,
      }
    });
  };

  const deletePost = (postId) => {
    console.log("🗑️ Deleting post with ID:", postId);
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
