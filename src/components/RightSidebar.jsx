import React from 'react';
import './RightSidebar.css';

const trendingTags = [
  'Vacation', 'SeaSide', 'ReactJS', 'Travel', 'Friends', 'Coding', 'Fun', 'Nature', 'Photography', 'Music'
];

const RightSidebar = () => {
  return (
    <aside className="right-sidebar">
      <div className="right-sidebar-section">
        <h4 className="right-sidebar-title">🔥 Trending Tags</h4>
        <div className="right-sidebar-tags">
          {trendingTags.map(tag => (
            <span key={tag} className="right-sidebar-tag">#{tag}</span>
          ))}
        </div>
      </div>
      <div className="right-sidebar-section">
        <h4 className="right-sidebar-title">ℹ️ About</h4>
        <p className="right-sidebar-about">This is a modern social media app built with React.js. Share your thoughts, connect with friends, and explore trending topics!</p>
      </div>
    </aside>
  );
};

export default RightSidebar; 