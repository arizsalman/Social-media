import React, { useState } from 'react'
import Header from './components/Header'
import Fooder from './components/Fooder'
import SideBar from './components/SideBar'
import CreatePost from './components/CreatePost'
import Post from './components/Post'
// import "../App.css";
import "./App.css";  
import Postlist from './components/Postlist'
import PostListProvider from './store/PostlistStore'

const App = () => {
  const [selectedTab,setSelectedTab]=useState("Home")
  return (
    <>
    
    <PostListProvider>
     <div className='app-container' >
      <Header/>
      <div className='content'>
        <SideBar selectedTab={selectedTab} setSelectedTab={setSelectedTab}></SideBar>
        {selectedTab==="Home"?( <CreatePost></CreatePost>):(   <Postlist></Postlist>) }
       
       {/* <Post></Post> */}
    
      </div>
      
      <Fooder></Fooder>
      </div>
      </PostListProvider>
    </>
  )
}

export default App
