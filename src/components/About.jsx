import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">ℹ️ About This App</h1>
      <p className="about-desc">
        This social media app is built with React.js to help you share your thoughts, connect with friends, and express yourself in a modern, beautiful environment.
      </p>
      <div className="about-team">
        <h2>👨‍💻 Our Team</h2>
        <ul>
          <li>Ali - Frontend Developer</li>
          <li>Sara - UI/UX Designer</li>
          <li>Ahmed - Backend Developer</li>
        </ul>
      </div>
      <p className="about-footer">Made with ❤️ for the community.</p>
    </div>
  );
};

export default About; 