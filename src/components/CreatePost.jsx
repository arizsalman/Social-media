import React, { useContext, useRef } from 'react'
import { PostList } from '../store/PostlistStore';

const CreatePost = () => {

  const { addPost } = useContext(PostList); 
  const userIdElement = useRef();
  const postTitleElement = useRef();
  const postBodyElement = useRef();
  const reactionsElement = useRef();
  const tagsElement = useRef();


  const handleSubmit =(event)=>{
    event.preventDefault() ;
    const userId=userIdElement.current.value ;
    const postTitle= postTitleElement.current.value ;
    const postBody= postBodyElement.current.value ;
    const reactions=reactionsElement.current.value; 
    const tags=tagsElement.current.value.trim().split(/\s+/);
    
    console.log("Calling addPost:", { userId, postTitle }); 
    addPost(userId,postTitle,postBody,reactions,tags)

  }

  return (
    <>
    <form className='create-post' onSubmit={handleSubmit}>

    <div className="mb-3 flex-grow-1 p-4">
    <label htmlFor="userId" className="form-label">
     Enter your User Id Here
    </label>
    <input
      type="type"
      className="form-control"
      id="userId"
      placeholder='Your user id'
     ref={userIdElement}
    />
   
  </div>  


  <div className="mb-3 flex-grow-1 p-4">
    <label htmlFor="title" className="form-label">
      Post Title 
    </label>
    <input
      type="type"
      className="form-control"
      id="title"
      placeholder='How are you felling today ....'
     ref={postTitleElement}
    />
   
  </div>

  <div className="mb-3 flex-grow-1 p-4">
    <label htmlFor="title" className="form-label">
      Post Content
    </label>
    <input
      type="type"
      rows="4"
      className="form-control"
      id="body"
      placeholder='Tell us more about it ....'
     ref={postBodyElement}
    />
   
  </div>
 
   
  <div className="mb-3 flex-grow-1 p-4">
    <label htmlFor="reaction" className="form-label">
      Number Of reaction
    </label>
    <input
      type="type"
      className="form-control"
      id="reactions"
      placeholder='How many people reacted to this post'
     ref={reactionsElement}
    />
   
  </div>


  <div className="mb-3 flex-grow-1 p-4">
    <label htmlFor="tags" className="form-label">
      Enter Your Hashtags here
    </label>
    <input
      type="type"
      className="form-control"
      id="tags"
      placeholder='Please Enter tags Using Space'
     ref={tagsElement }
    />
   
  </div>


  <button type="submit" className="btn btn-primary">
    Post
  </button>
</form>

    </>
  )
}

export default CreatePost
