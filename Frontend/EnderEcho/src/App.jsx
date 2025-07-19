import React from 'react'
import Navbar from './Components/Navbar'
import { Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import SignUpPage from './Pages/SignUpPage'
import LoginPage from './Pages/LoginPage'
import SettingsPage from './Pages/SettingsPage'
import ProfilePage from './Pages/ProfilePage'

const App = () => {
  return (
    <div>
      <Navbar/>

      <Routes>
        <Route path='/' element={<HomePage/>} ></Route>
        <Route path='/signup' element={<SignUpPage/>} ></Route>
        <Route path='/login' element={<LoginPage/>} ></Route>
        <Route path='/settings' element={<SettingsPage/>} ></Route>
        <Route path='/profile ' element={<ProfilePage/>} ></Route>
      </Routes>

    </div>
  )
}

export default App