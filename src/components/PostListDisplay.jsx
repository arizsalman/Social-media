import React, { useContext } from 'react';
import { PostList } from '../store/PostlistStore';


const PostListDisplay = () => {
  const { postList, deletePost } = useContext(PostList);

  return (
    <div>
      <h2>All Posts</h2>
      {postList.map(post => (
        <div key={post.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
          <p><strong>Reactions:</strong> {post.reaction}</p>
          <p><strong>Tags:</strong> {post.tags.join(", ")}</p>
          <button onClick={() => deletePost(post.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default PostListDisplay;
