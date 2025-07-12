import React, { useContext, useState } from 'react';
import { PostList } from '../store/PostlistStore';
import CreatePost from './CreatePost';
import './PostListDisplay.css';

const PostListDisplay = () => {
  const { postList, deletePost } = useContext(PostList);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleDelete = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(postId);
    }
  };

  const handleCreatePost = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  return (
    <div className="post-list-container">
      <div className="post-list-header">
        <div className="header-left">
          <h2 className="post-list-title">📱 All Posts</h2>
          <div className="post-count">
            {postList.length} {postList.length === 1 ? 'post' : 'posts'}
          </div>
        </div>
        <button 
          className="create-post-btn"
          onClick={handleCreatePost}
        >
          ✨ Create Post
        </button>
      </div>
      
      {postList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No posts yet</h3>
          <p>Create your first post to get started!</p>
          <button 
            className="create-first-post-btn"
            onClick={handleCreatePost}
          >
            Create Your First Post
          </button>
        </div>
      ) : (
        <div className="posts-grid">
          {postList.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="post-user-info">
                  <div className="user-avatar">
                    {post.user_id.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-details">
                    <span className="username">{post.user_id}</span>
                    <span className="post-date">Just now</span>
                  </div>
                </div>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(post.id)}
                  title="Delete post"
                >
                  🗑️
                </button>
              </div>
              
              <div className="post-content">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-body">{post.body}</p>
              </div>
              
              <div className="post-footer">
                <div className="post-reactions">
                  <span className="reaction-icon">❤️</span>
                  <span className="reaction-count">{post.reaction}</span>
                </div>
                
                <div className="post-tags">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>✨ Create New Post</h3>
              <button 
                className="modal-close-btn"
                onClick={handleCloseModal}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <CreatePost onPostCreated={handleCloseModal} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostListDisplay;
