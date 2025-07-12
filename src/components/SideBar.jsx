import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './SideBar.css';

const SideBar = () => {
  const location = useLocation();
  return (
    <aside className="sidebar-ui">
      <div className="sidebar-logo">
        <svg className="sidebar-logo-icon" width={32} height={32} aria-hidden="true">
          <use xlinkHref="#bootstrap" />
        </svg>
        <span className="sidebar-title">SocialApp</span>
      </div>
      <nav className="sidebar-nav">
        <Link to="/" className={`sidebar-link${location.pathname === '/' ? ' active' : ''}`}>
          <span className="sidebar-link-icon">🏠</span> Home
        </Link>
        <Link to="/create" className={`sidebar-link${location.pathname === '/create' ? ' active' : ''}`}>
          <span className="sidebar-link-icon">➕</span> Create Post
        </Link>
      </nav>
      <div className="sidebar-profile">
        <img
          src="https://github.com/mdo.png"
          alt="profile"
          width={32}
          height={32}
          className="sidebar-profile-img"
        />
        <div className="sidebar-profile-info">
          <span className="sidebar-profile-name">mdo</span>
          <span className="sidebar-profile-role">User</span>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
