import React, { useEffect, useRef, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast';
import styles from './LoginPage.module.css'
import useTheme from '../../GlobalState/ThemeStore'
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { FaEye ,FaEyeSlash} from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { IoIosCreate } from "react-icons/io";
import useUser from '../../GlobalState/UserStore';
import ShowToast from '../../Components/Toast/Toast';
import dark from '../../assets/LoginPage/dark.jpeg'
import showToast from '../../Components/Toast/Toast';

function LoginPage() {
    //UI States
    const [showPassword , setShowPassword] = useState(false);
    const {Theme , NavbarBG , SecondaryColor,  NavbarText , NavbarIcon ,LoadState} = useTheme();
    const [currentPage , SetCurrentPage] = useState('login');
    //Reference Hooks
    const PasswordRef = useRef()
    const UserRef = useRef()
    const ConfirmPasswordRef = useRef() ; 
    //Data States
    const [formData , SetFormData] = useState({
        UserName:'',
        Password:'',
        confirmPassword:''
    }) ;
    const {UserValidity , Signup , signin} = useUser();
    const Validate = () => {
        if(formData.confirmPassword === formData.Password){
            return true
        }
        return false
    }
     const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
        //invert the previous state
  };  
  const handleInput = async(event , ref) => {
    //DO a functional update and dont mutate directly
    if(ref === UserRef){
      SetFormData(prev => ({...prev , UserName:event.target.value}))
    }
    else if(ref === PasswordRef){
      SetFormData(prev => ({...prev , Password:event.target.value}))
    }
    else if(ref === ConfirmPasswordRef){
      SetFormData(prev => ({...prev , confirmPassword:event.target.value}))
    }
  }
  //To rest Form Data when page changes
  useEffect(() => SetFormData({UserName:'',Password:'',confirmPassword:''}) , [currentPage])
  
  const HandleSubmitClick = async () => {
    try {
        if(currentPage === 'register'){
        if(Validate()){
            
            const {UserName , Password} = formData
            const DataFromBackEnd =  await Signup({UserName , Password})

        }
        else
        {
            showToast("Password and Confirm Password Doesn't Match" , false)
    }
    
    }
    else if(currentPage == 'login'){
        const {UserName , Password} = formData;
        const DataFromBackEnd = await signin({UserName , Password})
        
    }
    } catch (error) {
        showToast(error.message , false)
        
    }
    
  }


  return (
    // Login Page Dominated
    <div className= {styles['mainPage-Div']}>
        <div className= {styles['loginPage-Div']}>
            <div  className= {styles['pageToolBar-Div']}>
            <button  onClick={() => SetCurrentPage('login')} style={{color:'white' ,backgroundColor:currentPage === 'login' ? NavbarIcon : 'transparent'}} className= {styles['pageSwitch-Button']}>
                Login Page
            </button>
            <button className= {styles['pageSwitch-Button']} onClick={() => SetCurrentPage('register')} style={{color:'white' ,backgroundColor:currentPage === 'register' ? NavbarIcon : 'transparent'}}>
                Register Page
            </button>
            </div>
            <p className= {styles['page-Label']} style={{color:SecondaryColor}}>
            {currentPage.toUpperCase()}
            </p>
            <div className= {styles['credentials-Div']}>
                
                <input value={formData.UserName} onChange={(event) => handleInput(event, UserRef)} required pattern=".{1,}" type='text' className= {styles['credentials-Input']} ></input>
                <p className= {styles['credentialsUser-Label']}>User Name</p>
                
            </div>
            <div className= {styles['credentials-Div']}>
                <input ref={PasswordRef} value={formData.Password}  onChange={(event) => handleInput(event , PasswordRef)} required pattern=".{1,}"  type={showPassword ? 'text' : 'Password'} className= {styles['credentials-Input']}></input>
                <p className= {styles['credentialsPassword-Label']}>{currentPage === 'login' ? 'Password' : 'Create Password'}
                </p>
                {currentPage === 'login' ? <button  onClick={togglePasswordVisibility} style={{color:NavbarText}} className= {styles['show-Button']}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button> : ''}
                
            </div>
            {currentPage === 'register' ? <div className= {styles['credentials-Div']}>
                <input ref={ConfirmPasswordRef} value={formData.confirmPassword} onChange={(event) => handleInput(event , ConfirmPasswordRef)} required pattern=".{1,}"  type={showPassword ? 'text' : 'Password'} className= {styles['credentials-Input']}></input>
                <p className= {styles['credentialsPassword-Label']}>Confirm Password
                </p>
            </div> : ''}
            
            <button  style={{color:NavbarText}} className= {styles['login-Button']} onClick={() => HandleSubmitClick()}>
                {currentPage == 'login' ? <FiLogIn style={{color:NavbarText}} className={styles['logo']}/>:<IoIosCreate />}
                
                {currentPage}
                </button>
            <div className={styles['registerContainer']}>
                {currentPage === 'login' ? <p style={{color:NavbarText}} className={styles['register']} onClick={() => SetCurrentPage('register')}>
                Register
            </p> : '' }
            
            </div>
            
        </div>
        </div>

  )
}

export default LoginPage