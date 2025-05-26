import React, { useEffect, useState } from 'react'
import styles from './SideBar.module.css'
import { UseChat } from '../../GlobalState/ChatStore'
import { IoMdContact } from "react-icons/io";
import useTheme from '../../GlobalState/ThemeStore';
import DefaultImage from '../../assets/LoginPage/default.jpg'
import useUser from '../../GlobalState/UserStore';
function SideBar() {
  const {AllUsers , SelectedUser , setSelectedUser , LoadUsers ,isLoadingUser} = UseChat() ;
  const {NavBarBG , SideBarText, NavbarText , SideBarBG ,SecondaryColor} = useTheme() ;
  const {OnlineUsers ,USer} = useUser();
  useEffect(() => {
    LoadUsers()
  } , [LoadUsers])
  const HandleUserButtonClick = (parm) => {
    if(parm === SelectedUser.id){
      setSelectedUser({})
    }
    else{
        const selected = AllUsers.find((user) => user._id === parm);
        
        setSelectedUser({id:selected._id , UserName:selected.UserName , ProfilePic:selected.ProfilePic})
    }
    
    
  }
  
  return (
    <div className= {styles['sideBar-Div']} >
        <div className= {styles['topSection-Div']} style={{color:SecondaryColor , background:NavBarBG }}>
          <IoMdContact style={{color:NavbarText}} className= {styles['contactIcon-Icon']}/>
          <p className= {styles['topSection-Label']}>
            Contacts
          </p>
        </div>
        <div className= {styles['userSection-Div']}> 
          {/* User Mapping */}
          {AllUsers.map((user) => {return <>
          <div className= {styles['userContainer-Div']} key={user._id} 
          onClick={() => {HandleUserButtonClick(user._id)}} style={{background: SelectedUser.id===user._id ? SideBarText

          : ''}}>
            <img src={user.ProfilePic || DefaultImage}
             className= {styles['userContainer-Image']}/>
             <span className= {styles['onlineIndicator-Span']} style={{backgroundColor:OnlineUsers.includes(user._id) ? "Green" : "Red" , filter:`drop-shadow(0 0 0.25rem ${OnlineUsers.includes(user._id) ? "Green" : "Red"})`}}></span>
            <p className= {styles['userContainer-Label']} style={{color:SecondaryColor}}>{user.UserName}</p>
            {/* <div className={styles['statusContainer-Div']}>
              <p className= {styles['userContainer-Label']} style={{color:SecondaryColor}}>Status:</p>
              <p className= {styles['userContainer-Label']} style={{color:SecondaryColor}}>Offile</p>
            </div> */}
            

          </div>
          
          </>})}
          
        </div>
        
    </div>
  )
}

export default SideBar