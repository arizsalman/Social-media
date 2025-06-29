import React from 'react'
import Header from './components/Header'
import Fooder from './components/Fooder'
import SideBar from './components/SideBar'

const App = () => {
  return (
    <>
    <div className='app-container' >
      <Header/>
      <div className='content'>
      <SideBar/>
      <Fooder/>
      </div>
      
      </div>

    </>
  )
}

export default App
