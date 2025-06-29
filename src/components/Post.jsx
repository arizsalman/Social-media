import React, { useContext } from 'react'
import { MdDeleteForever } from "react-icons/md";
import { PostList } from '../store/PostlistStore';

const Post = ({post}) => {
   const{deletePost}=useContext(PostList)
  
  
  return (
    <>
    <div className="card" style={{ width: "18rem",margin:"20px" }}>
 
  <div className="card-body">
    <h5 className="card-title">{post.title}
    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
    onClick={()=>deletePost(post.id)}
    >
    <MdDeleteForever />
   
    </span>
    </h5>
    <p className="card-text">
      {post.body}
    </p>
   
    {post.tags.map((tag) => (
       <span key={tag} type="button" className="btn btn-outline-warning" style={{ marginRight: "5px" }}>
        {tag}
       </span>
    ))}
    <div className="alert alert-danger" role="alert">
      This Post has been by {post.reaction} people
    </div>
    
  </div>
</div>
    </>
  )
}

export default Post
