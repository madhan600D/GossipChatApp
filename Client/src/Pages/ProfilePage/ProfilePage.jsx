import React, { useRef, useState ,useEffect} from 'react'
import styles from './ProfilePage.module.css'
import useUser from '../../GlobalState/UserStore'
import useTheme from '../../GlobalState/ThemeStore'
import Defaultimage from '../../assets/LoginPage/default.jpg'
import { FaCameraRetro } from "react-icons/fa";
import showToast from '../../Components/Toast/Toast.js'
import CameraIcon from '../../assets/LoginPage/camera.jpg'
function ProfilePage() {
  const {checkAuth , User , UserValidity , isLoading ,EditProfile ,isUploadingImage} = useUser();
  const {NavbarText , SecondaryColor} = useTheme()
  const FileInputRef = useRef(null)
  
  const handleIconClick = () => {
    FileInputRef.current.click()
  }
const handleImageUpload = (e) => {
  const File = e.target.files[0];
  const Reader = new FileReader();


  Reader.onload = async () => {
    const Base64ofFile = Reader.result;
    
    await EditProfile(Base64ofFile);
  };

  Reader.readAsDataURL(File); 
};
  if (isLoading) return <p>Checking authentication...</p>
  return (
    <div className= {styles['profilePage-Div']}>
        <div className= {styles['profilePageInner-Div']}>
            <div className = {styles['topContent-Div']}>
                <p className= {styles['topContent-Label']} style={{color:NavbarText}}>
                    Profile Page
                </p>
                <p className= {styles['topContent-Label']}>
                    Your profile information
                </p>
            <div className= {styles['profileImage-Div']} >
                <img  className= {styles['profileImage-Image']} alt='Image' src= {User.ProfilePic || Defaultimage }></img>
                <FaCameraRetro type='file' onClick={handleIconClick} className= {styles['profileImage-Button']}  style={{color:NavbarText}}/>
                <input type='file' accept='image/*' ref={FileInputRef} onChange={() => handleImageUpload(event)} style={{display:'none'}} />
                {!isUploadingImage ? <p className= {styles['profileImage-Label']} style={{color:NavbarText}}>Click on the image to change pic</p> :
                <p className= {styles['profileImage-Label']} style={{color:NavbarText}}>Uploading image. Please Wait.</p>}
            </div>    
            </div>
            
            <div className= {styles['userContent-Div']}>
                <p  className= {styles['profileImage-Label']} style={{color:NavbarText}}>UserName:</p>
                <div className= {styles['credentials-Div']}>      
                    <input disabled value= "" required pattern=".{1,}" type='text' className= {styles['credentials-Input']} onClick={() => {showToast('Cant edit username',false)}} ></input>
                    <p className= {styles['credentialsUser-Label']}>{User.UserName}</p>               
                </div>
                <br />
                
            </div>
            
        </div>
        

    </div>
  )
}

export default ProfilePage