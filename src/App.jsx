import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Fooder from './components/Fooder';
import SideBar from './components/SideBar';
import CreatePost from './components/CreatePost';
import PostListDisplay from './components/PostListDisplay';
import Features from './components/Features';
import Pricing from './components/Pricing';
import FAQs from './components/FAQs';
import About from './components/About';
import PostListProvider from './store/PostlistStore';
import './App.css';

const App = () => {
  return (
    <PostListProvider>
      <Router>
        <div className="app-container">
          <Header />
          <div className="content d-flex">
            <SideBar />
            <div className="flex-grow-1 p-4">
              <Routes>
                <Route path="/" element={<PostListDisplay />} />
                <Route path="/create" element={<CreatePost />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </div>
          </div>
          <Fooder />
        </div>
      </Router>
    </PostListProvider>
  );
};

export default App;