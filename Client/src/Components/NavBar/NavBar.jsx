import React, { use } from 'react'
import styles from './NavBar.module.css'
import { HiMiniChatBubbleLeftRight } from "react-icons/hi2";
import { FaGear } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import useTheme  from '../../GlobalState/ThemeStore';
import { IoIosColorPalette } from "react-icons/io";
import useUser from '../../GlobalState/UserStore';
import ThemePicker from '../ThemePicker/ThemePicker';
import { useNavigate } from 'react-router-dom';
function NavBar() {

  const {UserValidity ,logout} = useUser();
  const {NavbarBG,NavbarText,NavbarIcon,SetTheme} = useTheme();
  const Navigate = useNavigate()
  const HandleLogoutButtonClick = async () => {
      try {
  
        const res =  await logout()
      } catch (error) {
        console.log(error)
      }
  }
  return (
    <div className={styles['navbar-Div']} style={{backgroundColor:NavbarBG}}>
      <div className={styles['navbarLeft-Div']} onClick={() => {Navigate('/')}}>
        <HiMiniChatBubbleLeftRight  className={styles['chat-Icon']} style={{fill:NavbarIcon}}/>
        <p style = {{color:NavbarText}}className={styles['appName-label']}>GossipChat</p>
      </div>
      <div className={styles['navbarRight-Div']} >
        {UserValidity ? <div className={styles['icon-Div']} onClick={HandleLogoutButtonClick}>
          <IoLogOut className={styles['settings-Icon']} style={{fill:NavbarIcon}}/>
          <p style = {{color:NavbarText}}className={styles['icon-Label']}>Log Out</p>
        </div> : ""}
        <div onClick={() => Navigate('/profile-page')} className={styles['icon-Div']}>
          <FaGear className={styles['settings-Icon']} style={{fill:NavbarIcon}}/>
          <p style = {{color:NavbarText}}className={styles['icon-Label']}>Settings</p>
        </div>
         <div  className={styles['themeicon-Div']}>
          <div className= {styles['themeComponent-Div']}>
              <ThemePicker className={styles['themePicker-Icon']}/>
          </div>
          
          <IoIosColorPalette className={styles['theme-Icon']} style={{fill:NavbarIcon}}/>
          {/* <p style = {{color:NavbarText}}className={styles['icon-Label']}>Theme</p> */}
        </div>
      </div>
    </div>
  )
}

export default NavBar