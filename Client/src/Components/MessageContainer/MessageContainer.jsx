import React, { useEffect, useState } from 'react'
import { UseChat } from '../../GlobalState/ChatStore';
import styles from './MessageContainer.module.css'
import { IoMdChatbubbles } from "react-icons/io";
import { FaReact } from "react-icons/fa";
import DefaultImage from '../../assets/LoginPage/default.jpg'
import useTheme from '../../GlobalState/ThemeStore';
import { SiExpress ,SiFoodpanda ,SiMongodb, SiSocketdotio } from "react-icons/si";
import { FaHandSparkles } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { FaImage } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { useRef } from 'react';
import useUser from '../../GlobalState/UserStore.js';
import showToast from '../Toast/Toast.js';
import ChatBubble from '../ChatBubble/ChatBubble.jsx';
function MessageContainer() {
  const { LoadMessages , Messages , SelectedUser ,setSelectedUser , SendMessage , ListenMessages , UnListenMessages} = UseChat();
  const ScrollRef = useRef()
  const {DestinationChatBubbleText,SourceChatBubbleText,DestinationChatBubbleBG, SourceChatBubbleBG,SideBarBG , NavbarText,SecondaryColor} = useTheme();
  const [currentMessage , setCurrentMessage] = useState('');
  const [selectedImage , setSelectedImage] = useState() ;
  const FileInputRef = useRef() ; 
  const {OnlineUsers,User} = useUser(); 
  //Hook to load messages
  useEffect(() => {
  const fetchMessages = () => {
    
      LoadMessages(SelectedUser.id); 
      ListenMessages();

      // In a useeffeect hook if the calling function is async wrap the function in a arrow async to avoid promise erros
      
    
  };
  
  fetchMessages();
  return () => UnListenMessages()
}, [SelectedUser?.id, LoadMessages]);
  const handleIconClick = () => {
    FileInputRef.current.click()
  }

  function HandleMessageInput(e){
    setCurrentMessage(e.target.value);
  }
  //Clears Input state when selected user changes
  useEffect(() => {setSelectedImage('') 
  setCurrentMessage('')}
  
   , [SelectedUser])
   //to scroll to the end
   useEffect(() => {
  if (ScrollRef.current) {
    ScrollRef.current.scrollTop = ScrollRef.current.scrollHeight;
  }
}, [Messages]); 
  const handleImageUpload = (e) => {
    const File = e.target.files[0];
    if(File){
      const Reader = new FileReader();
      Reader.onload = async () => {
      const Base64ofFile = Reader.result;
      setSelectedImage(Base64ofFile)
        };
      


    Reader.readAsDataURL(File); 
    }
    else{

      showToast("Please select a image" , false)
      return 
      
    }
};
  async function HandleSendButtonClick(destination){
    //Validation
    try {
      if(!currentMessage && !selectedImage){
        showToast("No message to be sent" , false);
        return
      }
      if(currentMessage.length > 100){
        showToast("Message length exceeds limit pf 100" , false) ;
        return 
      }
      const data = {currentMessage , selectedImage}
      SendMessage(destination , data)
      setCurrentMessage('')
      setSelectedImage('')
    } catch (error) {
      showToast(error.message , false)
    }
  }

  //Render
  if(SelectedUser.UserName){
    return(
    <div className = {styles['messageContainer-Div']}>
        <div style={{backgroundColor:SideBarBG}} className = {styles['topPanel-Div']}>
          <div  className = {styles['topPanelLeft-Div']}>
            <div className = {styles['topPanelLeftUser-Div']}>
              <img className= {styles['topPanelLeft-Image']} src={SelectedUser.ProfilePic || DefaultImage} />
              <p style={{fontSize:'20px' , color:NavbarText}}>
              
              {SelectedUser.UserName}
            </p>
            <div className = {styles['topStatusBar-Div']}>
                <p style={{fontSize:'15px' ,color:`${OnlineUsers.includes(SelectedUser.id) ? "Green" : "Red"}`}}>
                  {OnlineUsers.includes(SelectedUser.id) ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            
          </div>
          <div  className = {styles['topPanelRight-Div']}>
              <button className = {styles['close-Button']}>
                <IoIosCloseCircle onClick={() => setSelectedUser({})}  className = {styles['close-Icon']}/>
              </button>
          </div>

        </div>
        <div  ref={ScrollRef} className = {styles['messagePanel-Div']}>

            {Messages.map((data) =>{
              //Source Message
              if(data.SenderID == User._id){

                  return(<div style={{ alignSelf: 'end',marginBottom:'10px' ,color:SourceChatBubbleText}}>
                  <ChatBubble  
                  ProfilePic={User.ProfilePic} 
                  image={data.Image}
                  text={data.Text} 
                  ChatBubbleBG = {SourceChatBubbleBG}
                  orientation={'row-reverse'}
                  /> 
                  </div>)
              }
              //Destination Message
              else if (data.SenderID == SelectedUser.id){
                return(<div style={{ alignSelf: 'start' ,marginBottom:'10px' , color:DestinationChatBubbleText}}>
                  <ChatBubble  
                  ProfilePic={SelectedUser.ProfilePic} 
                  image={data.Image}
                  text={data.Text} 
                  ChatBubbleBG = {DestinationChatBubbleBG}
                  orientation={'row'}
                  /> 
                  </div>)
              }
              
               
            }
            
            )}
            
            
          
        </div>
        {selectedImage ? <div className= {styles['imagePreview-Div']}>
                        <IoIosClose onClick={() => setSelectedImage('')} className= {styles['imagePreview-Button']} style={{color:SecondaryColor ,height:'1.5rem' , width:'1.5rem' ,backgroundColor:NavbarText , borderRadius:'50%',transform:'translate(5rem,1rem)'}} />
                        <img src={selectedImage} className= {styles['imagePreview-Image']}/>
                    </div> : ''}
        
        <div  style={{background:'transparent'}} className = {styles['messageInputPanel-Div']}>
          
          <input className = {styles['message-Input']} onChange={HandleMessageInput} value={currentMessage} placeholder='Enter the message...' />
          <button onClick={() => HandleSendButtonClick(SelectedUser.id)} disabled = {!currentMessage && !selectedImage} style={{background:'transparent' , opacity: (!currentMessage && !selectedImage) ? '0.2' : '1'}} className = {styles['bottom-Button']}>
                <IoMdSend style={{color:NavbarText}} className = {styles['close-Icon']} />
                
            </button>
            <button style={{background:'transparent'}} className = {styles['bottom-Button']} onClick={handleIconClick}>
  
                <FaImage style={{color:NavbarText}} className = {styles['close-Icon']} />
                <input type='file' accept='image/*' ref={FileInputRef} onChange={() => handleImageUpload(event)} style={{display:'none'}} />
                
            </button>
          
        </div>
      </div>
      )
  }
  else{
    return(
      <>
      <div className = {styles['mainContainer-Div']}>
        <div className = {styles['welcomeContainer-Div']}>
        <div  className = {styles['welcomeIconContainer-Div']}>
          <IoMdChatbubbles className = {styles['welcomeContainer-Icon']} style={{color:NavbarText}}/>
        </div>
        <p style={{color:SecondaryColor}} className = {styles['welcome-Label']}>
          Welcome to GOSSIP Chat application. <br/>
        </p>
        <p  style={{color:SecondaryColor}} className = {styles['welcomeContainer-Label']}>
      
        Made using React {<FaReact className = {styles['icon']}/>}, 
         ExpressJS {<SiExpress className = {styles['icon']}/>}, 
         Zustand {<SiFoodpanda  className = {styles['icon']}/>} 
         ,MongoDB {<SiMongodb className = {styles['icon']} />},
         & Socket I.O {<SiSocketdotio />}
        </p>
      </div>
      </div>
      
      </>
    )
  }
}

export default MessageContainer
