import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import CreatePost from './components/CreatePost';
import PostListDisplay from './components/PostListDisplay';
import Features from './components/Features';
import Pricing from './components/Pricing';
import FAQs from './components/FAQs';
import About from './components/About';
import RightSidebar from './components/RightSidebar';
import TogglCalendarView from './components/TogglCalendarView';
import PostListProvider from './store/PostlistStore';
import './App.css';
import FirebaseAuth from './components/FirebaseAuth';

function MainLayout() {
  const location = useLocation();
  const isGoalsPage = location.pathname === '/goals';
  return (
    <div className="app-container">
      <Header />
      <div className="content d-flex" style={{alignItems: 'flex-start'}}>
        <div className="flex-grow-1 p-4">
          <Routes>
            <Route path="/" element={<PostListDisplay />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/about" element={<About />} />
            <Route path="/goals" element={<TogglCalendarView />} />
            <Route path="/login" element={<FirebaseAuth />} />
            <Route path="/signup" element={<FirebaseAuth />} />
          </Routes>
        </div>
        {!isGoalsPage && <RightSidebar />}
      </div>
    </div>
  );
}

const App = () => {
  return (
    <PostListProvider>
      <Router>
        <MainLayout />
      </Router>
    </PostListProvider>
  );
};

export default App;