import { useState } from 'react'
import './App.css'
import Login from './components/Login/Login'
import { Link } from 'react-router-dom'
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import NewUser from './components/Login/NewUser'

function App() {
 
  return (
    // <Router>
      <div className="App">
        {/* <Routes>
          <Route path="/" element={<Login />}/>
        </Routes> */}
        <Login/>
      </div>
    // </Router>
  )
}

export default App;