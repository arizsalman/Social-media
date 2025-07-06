// import React, { useState } from 'react'
// import Header from './components/Header'
// import Fooder from './components/Fooder'
// import SideBar from './components/SideBar'
// import CreatePost from './components/CreatePost'
// import Post from './components/Post'
// // import "../App.css";
// import "./App.css";  
// import Postlist from './components/Postlist'
// import PostListProvider from './store/PostlistStore'

// const App = () => {
//   const [selectedTab,setSelectedTab]=useState("Home")
//   return (
//     <>
    
//     <PostListProvider>
//      <div className='app-container' >
//       <Header/>
//       <div className='content'>
//         <SideBar selectedTab={selectedTab} setSelectedTab={setSelectedTab}></SideBar>
//         {selectedTab === "Home" ? (
//             <Postlist />
//         ) : (
//            <CreatePost />
//            )}
       
//        {/* <Post></Post> */}
    
//       </div>
      
//       <Fooder></Fooder>
//       </div>
//       </PostListProvider>
//     </>
//   )
// }

// export default App

import React, { useState } from 'react';
import Header from './components/Header';
import Fooder from './components/Fooder';
import SideBar from './components/SideBar';
import CreatePost from './components/CreatePost';
import PostListDisplay from './components/PostListDisplay'; // 👈 rename Postlist.jsx to this
import PostListProvider from './store/PostlistStore';
import './App.css';

const App = () => {
  const [selectedTab, setSelectedTab] = useState("Home");

  return (
    <PostListProvider>
      <div className="app-container">
        <Header />
        <div className="content d-flex">
          <SideBar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
          <div className="flex-grow-1 p-4">
            {selectedTab === "Home" ? <PostListDisplay /> : <CreatePost />}
          </div>
        </div>
        <Fooder />
      </div>
    </PostListProvider>
  );
};

export default App;