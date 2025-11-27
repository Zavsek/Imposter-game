import { useState, useEffect } from "react";
import React from "react";
import "./App.css";
import{Routes, Route, Navigate ,useNavigate} from 'react-router-dom'
import {useIgralecStore} from './store/useIgralecstore.js'
import {LoadingScreen} from "./components/loadingScreen.jsx";
import HomePage from "./components/pages/HomePage.jsx";
import CreateUserPage from "./components/pages/CreateUserPage.jsx";
import GamePage from "./components/pages/GamePage.jsx";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar.jsx";
import { useIgraStore } from "./store/useIgraStore.js";


function App() {
console.log('React instance v App:', React);
  const{checkingUser,checkUser, userInstance} = useIgralecStore()
  const{gameInstance, creatingGame} = useIgraStore();
  const navigate = useNavigate();
  
  useEffect(() =>{checkUser();}, [checkUser]);

   useEffect(() => {
    if (gameInstance) {
      navigate("/game");
    }
  }, [gameInstance, navigate]);


  if(checkingUser || creatingGame) return(<LoadingScreen/>);
  return (
    <div>
    {userInstance && <Navbar/>}
    <Routes>
      <Route path="/CreatePlayer" element={!userInstance ? <CreateUserPage/> : <Navigate to="/"/>}/>
      <Route path="/" element={userInstance ?<HomePage/> : <Navigate to="/CreatePlayer"/>}/>
      <Route path="/game" element={!userInstance ? <Navigate to="/CreatePlayer"/> : !gameInstance ? <Navigate to="/" />: <GamePage/> }/>     </Routes>
    <Toaster />
    </div>
  );
}

export default App;
