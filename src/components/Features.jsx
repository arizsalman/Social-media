import React from 'react';
import './Features.css';

const Features = () => {
  return (
    <div className="features-container">
      <h1 className="features-title">✨ App Features</h1>
      <ul className="features-list">
        <li>📝 Effortless post creation, viewing & deletion</li>
        <li>💬 Modern & responsive UI/UX for all devices</li>
        <li>🏷️ Hashtags support for better content discovery</li>
        <li>❤️ Real-time reactions & engagement on posts</li>
        <li>🔒 Secure & user-friendly modal forms</li>
        <li>📱 100% mobile friendly experience</li>
        <li>📅 Integrated goals & calendar view</li>
        <li>🔔 Instant notifications for new activity</li>
        <li>🔍 Powerful search & filter for posts</li>
        <li>🛡️ Privacy & data security guaranteed</li>
      </ul>
      <p className="features-note">More features coming soon!</p>
    </div>
  );
};

export default Features; 