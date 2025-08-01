import React, { useState, useEffect } from 'react'
import'bootstrap/dist/css/bootstrap.min.css'
import { Link } from 'react-router-dom';
import LoginModal from './LoginModal';

const Header = () => {
  // Persistent authentication state
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('demoUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogin = (userObj) => {
    setUser(userObj);
    localStorage.setItem('demoUser', JSON.stringify(userObj));
  };
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('demoUser');
  };

  return (
    <>
      <header className="p-3 text-bg-dark">
  {" "}
  <div className="container">
    {" "}
    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
      {" "}
      <Link
        to="/"
        className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
      >
        {" "}
        <svg
          className="bi me-2"
          width={40}
          height={32}
          role="img"
          aria-label="Bootstrap"
        >
          <use xlinkHref="#bootstrap" />
        </svg>{" "}
      </Link>{" "}
      <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
        {" "}
        <li>
          <Link to="/" className="nav-link px-2 text-secondary">
            Home
          </Link>
        </li>{" "}
        <li>
          <Link to="/goals" className="nav-link px-2 text-white">
            Goals
          </Link>
        </li>{" "}
        <li>
          <Link to="/features" className="nav-link px-2 text-white">
            Features
          </Link>
        </li>{" "}
        <li>
          <Link to="/pricing" className="nav-link px-2 text-white">
            Pricing
          </Link>
        </li>{" "}
        <li>
          <Link to="/faqs" className="nav-link px-2 text-white">
            FAQs
          </Link>
        </li>{" "}
        <li>
          <Link to="/about" className="nav-link px-2 text-white">
            About
          </Link>
        </li>{" "}
      </ul>{" "}
      <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
        {" "}
        <input
          type="search"
          className="form-control form-control-dark text-bg-dark"
          placeholder="Search..."
          aria-label="Search"
        />{" "}
      </form>{" "}
      <div className="text-end">
        {user ? (
          <>
            <span className="me-3 text-info fw-bold">👤 {user.username}</span>
            <button type="button" className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button type="button" className="btn btn-outline-light me-2" onClick={() => setShowLogin(true)}>
              Login
            </button>
            <button type="button" className="btn btn-warning" onClick={() => setShowLogin(true)}>
              Sign-up
            </button>
          </>
        )}
      </div>{" "}
    </div>{" "}
  </div>{" "}
</header>

      <LoginModal show={showLogin} onClose={() => setShowLogin(false)} onLogin={handleLogin} />
    </>
  )
}

export default Header
