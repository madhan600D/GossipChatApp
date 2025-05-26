import React from 'react'
import styles from './ChatBubble.module.css'
import DefaultImage from '../../assets/LoginPage/default.jpg'
import useTheme from '../../GlobalState/ThemeStore'
function ChatBubble({ProfilePic , image , text ,ChatBubbleBG ,orientation}) {
    
        return (
            <div style={{flexDirection:orientation}} className = {styles['chatBubble-Div']}>
                <img className = {styles['chatBubbleProfile-Image']} src= {ProfilePic || DefaultImage} />
                <div style={{backgroundColor:ChatBubbleBG}} className = {styles['chatBubbleContent-Div']}>
                    {image && (
                    <div className = {styles['chatBubbleImage-Div']}>
                        <img className = {styles['chatBubble-Image']} src= {image}  alt='Couldnt load image'/>
                    </div>
                    )}
                    <p className = {styles['chatBubbleText-Label']}> {text} </p>
                </div>
                
            </div>
            )
        }

export default ChatBubble