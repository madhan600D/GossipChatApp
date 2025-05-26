import React from 'react'
import styles from './ThemePicker.module.css'
import dark from '../../assets/LoginPage/dark.jpeg'
import winter from '../../assets/LoginPage/winter.jpg'
import sunset from '../../assets/LoginPage/sunset.jpg'
import useTheme from '../../GlobalState/ThemeStore'
function ThemePicker() {
    const {SetTheme} = useTheme();
  return (
    <div className= {styles['theme-Container']}>
        <button onClick={() => SetTheme('dark')} style={{backgroundImage:`url(${winter})` , filter:'brightness(3)'}} className = {styles['theme-Button']}>
            <p className = {styles['theme-Label']}>DARK</p>
        </button>
        <button onClick={() => SetTheme('sunset')} style={{backgroundImage:`url(${sunset})`}} className = {styles['theme-Button']}>
            <p className = {styles['theme-Label']}>SUNSET</p>
        </button>
        <button onClick={() => SetTheme('moody')} style={{backgroundImage:`url(${dark})`}} className = {styles['theme-Button']}>
            <p  className = {styles['theme-Label']}>MOODY</p>
        </button>
    </div>
  )
}

export default ThemePicker