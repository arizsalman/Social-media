import React from 'react';
import './Goals.css';

const Goals = () => {
  return (
    <aside className="goals-sidebar">
      <div className="goals-section">
        <h4 className="goals-title">🎯 My App Goals</h4>
        <ul className="goals-list">
          <li>✔️ Modern, clean UI/UX</li>
          <li>✔️ User authentication (login/signup)</li>
          <li>✔️ Create, view, and delete posts</li>
          <li>✔️ Trending tags and suggestions</li>
          <li>✔️ Responsive design for all devices</li>
          <li>✔️ Modular, maintainable code</li>
        </ul>
        <div className="goals-note">(Aap yahan apne app ke goals ya features likh sakte hain!)</div>
      </div>
    </aside>
  );
};

export default Goals; 