// import React, { useContext } from 'react'
// import Post from './Post'
// import { PostList as PostListData } from '../store/PostlistStore'

// const Postlist = () => {
//   const {postList}= useContext(PostListData)
//   return (
//     <>
//     {postList.map((post)=>(
//       <Post key={post.id} post={post}/>
//     ))}
      
//     </>
//   )
// }

// export default Postlist



import React, { useContext } from 'react';
import { PostList } from '../store/PostlistStore';

const PostListDisplay = () => {
  const { postList } = useContext(PostList);

  return (
    <div>
      <h2>All Posts</h2>
      {postList.length === 0 ? (
        <p>No posts yet</p>
      ) : (
        postList.map((post) => (
          <div key={post.id} className="card m-2 p-2">
            <h5>{post.title}</h5>
            <p>{post.body}</p>
            <small>Reactions: {post.reaction}</small>
            <br />
            <small>Tags: {post.tags.join(', ')}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default PostListDisplay;
