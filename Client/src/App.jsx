import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from './Components/NavBar/NavBar'
//Pages
import LoginPage from '../src/Pages/Sign IN/LoginPage.jsx'
import HomePage from './Pages/HomePage/HomePage.jsx';
import ProfilePage from './Pages/ProfilePage/ProfilePage.jsx';
import dark from './assets/LoginPage/dark.jpeg'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useUser from '../src/GlobalState/UserStore'
import { useEffect } from 'react';
import ThemePage from './Pages/ThemePage/ThemePage.jsx';
//Global Hooks
import useTheme from './GlobalState/ThemeStore.js';
function App() {
  //Verify JWT token and redirect pages accordingly
  const {checkAuth , UserValidity ,isLoading , OnlineUsers} = useUser() ; 
  const {PageBG , LoadState} = useTheme();
  useEffect( () => {
    checkAuth()
  } , [checkAuth])
  
useEffect(() => {
    const fetchtheme = () => {
        LoadState(); 
        // In a useeffeect hook if the calling function is async wrap the function in a arrow async to avoid promise erros
    };
    
    fetchtheme();
  }, [LoadState]);

  
  if (isLoading) return <p>Checking authentication...</p>;
  return (
    <div className='Main' style={{backgroundColor:PageBG ,backgroundImage: `url(${PageBG})`}} >
      
      <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/login" element={UserValidity ? <HomePage /> : <LoginPage /> } />
        <Route path="/" element={UserValidity ? <HomePage /> : <LoginPage />} />
        <Route path="/profile-page" element={UserValidity ? <ProfilePage /> : <LoginPage />} />
        <Route path='/theme-page' element = {<ThemePage />} />
      </Routes>
        
      </BrowserRouter>
      <ToastContainer /> 
    </div>
  )
}

export default App
