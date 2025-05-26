import React from 'react'
import SideBar from '../../Components/SideBar/SideBar'
import MessageContainer from '../../Components/MessageContainer/MessageContainer'
import styles from './HomePage.module.css'
function HomePage() {
  
  return (
    <div className={styles['homePage-Div']}>
      <div className={styles['leftSide-Div'] }> 
        <SideBar />
      </div>
      <div className={styles['rightSide-Div']}> 
          <MessageContainer />
      </div>
    </div>
  )
}

export default HomePage