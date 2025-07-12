import React, { useContext, useRef } from 'react'
import { PostList } from '../store/PostlistStore';
import './CreatePost.css';

const CreatePost = ({ onPostCreated }) => {

  const { addPost } = useContext(PostList); 
  const userIdElement = useRef();
  const postTitleElement = useRef();
  const postBodyElement = useRef();
  const reactionsElement = useRef();
  const tagsElement = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    const userId = userIdElement.current.value;
    const postTitle = postTitleElement.current.value;
    const postBody = postBodyElement.current.value;
    const reactions = reactionsElement.current.value; 
    const tags = tagsElement.current.value.trim().split(/\s+/);
    
    // Clear form
    userIdElement.current.value = "";
    postTitleElement.current.value = "";
    postBodyElement.current.value = "";
    reactionsElement.current.value = "";
    tagsElement.current.value = "";

    console.log("Calling addPost:", { userId, postTitle }); 
    addPost(userId, postTitle, postBody, reactions, tags);
    
    // Close modal after successful post creation
    if (onPostCreated) {
      onPostCreated();
    }
  }

  return (
    <form className='create-post-form' onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="userId" className="form-label">
          👤 User ID
        </label>
        <input
          type="text"
          className="form-input"
          id="userId"
          placeholder='Enter your user ID'
          ref={userIdElement}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="title" className="form-label">
          📝 Post Title
        </label>
        <input
          type="text"
          className="form-input"
          id="title"
          placeholder='How are you feeling today?'
          ref={postTitleElement}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="body" className="form-label">
          💭 Post Content
        </label>
        <textarea
          className="form-textarea"
          id="body"
          placeholder='Tell us more about it...'
          rows="4"
          ref={postBodyElement}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="reactions" className="form-label">
          ❤️ Reactions Count
        </label>
        <input
          type="number"
          className="form-input"
          id="reactions"
          placeholder='0'
          ref={reactionsElement}
          min="0"
          defaultValue="0"
        />
      </div>

      <div className="form-group">
        <label htmlFor="tags" className="form-label">
          🏷️ Hashtags
        </label>
        <input
          type="text"
          className="form-input"
          id="tags"
          placeholder='Enter tags separated by spaces (e.g., vacation travel)'
          ref={tagsElement}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          🚀 Create Post
        </button>
      </div>
    </form>
  )
}

export default CreatePost
