import React, { useRef } from 'react'

const CreatePost = () => {

  const userId = useRef();
  const postTitle = useRef();
  const postBody = useRef();
  const reactions = useRef();
  const tags = useRef();


  return (
    <>
    <form className='create-post'>

    <div className="mb-3 flex-grow-1 p-4">
    <label htmlFor="userId" className="form-label">
     Enter your User Id Here
    </label>
    <input
      type="type"
      className="form-control"
      id="userId"
      placeholder='Your user id'
     ref={userId}
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
     ref={postTitle}
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
     ref={postBody}
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
     ref={reactions}
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
     ref={tags}
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
