import React from 'react';
import './Features.css';

const Features = () => {
  return (
    <div className="features-container">
      <h1 className="features-title">✨ App Features</h1>
      <ul className="features-list">
        <li>📝 Create, view, and delete posts</li>
        <li>💬 Modern, responsive UI/UX</li>
        <li>🏷️ Add hashtags to your posts</li>
        <li>❤️ Reactions count for each post</li>
        <li>🔒 User-friendly modal forms</li>
        <li>📱 Mobile-friendly design</li>
      </ul>
      <p className="features-note">More features coming soon!</p>
    </div>
  );
};

export default Features; 