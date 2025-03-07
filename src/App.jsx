import { useState } from 'react'
import './App.css'
import Login from './components/Login/Login'
import { Link } from 'react-router-dom'
import NewUser from './components/Login/NewUser'
import { showSuccessToast, showErrorToast } from './components/Login/toastConfig'

function App() {
 
  return (
      <div className="App">
        <Login/>
      </div>
  )
}

export default App;