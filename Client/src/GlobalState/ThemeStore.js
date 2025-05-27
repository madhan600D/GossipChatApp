import { create } from 'zustand';
// Import the BG
import moody from '../assets/LoginPage/dark.jpeg';
import dark from '../assets/LoginPage/winter.jpg';
import sunset from '../assets/LoginPage/sunset.jpg';
import AxiosInstance from '../Lib/AxiosInstance.js';
import showToast from '../Components/Toast/Toast.js';
//File import 
const useTheme = create((set, get) => ({
  NavbarBG: '#222831',
  NavbarText: '#A86523',
  NavbarIcon: '#A35A00',
  SecondaryColor: '#ffffffc9',
  PageBG: dark,
  ButtonText: '',
  SideBarText: '',
  SourceChatBubbleBG: '#3E8B8B',
  SourceChatBubbleText: '',
  DestinationChatBubbleBG: '#033a2e',
  DestinationChatBubbleText: '',

  ThemeStates: {
    MoodyTheme: [
      '#192D34',       // NavbarBG
      '#A86523',       // NavbarText
      '#38807F',       // NavbarIcon
      '#ffffffc9',     // SecondaryColor , 
      moody,           // PageBG  
      '#00CEC8',       // ButtonText
      '#008C8F',       // SideBarText
      '#7BD04A',       // SourceChatBubbleBG
        '#CCF0F0',            // SourceChatBubbleText
      '#23484E',       // DestinationChatBubbleBG
      '#FFFFDF',       // DestinationChatBubbleText
    ],
    DarkTheme: [
      '#222831',       // NavbarBG
      '#A86523',       // NavbarText
      '#A35A00',       // NavbarIcon
      '#ffffffc9',     // SecondaryColor , 
      dark,       // PageBG  
      '#00CEC8',       // ButtonText
      '#C19A6B',       // SideBarText
      '#C19A6B',       // SourceChatBubbleBG
        '',        // SourceChatBubbleText
      '#55342B',       // DestinationChatBubbleBG
      '#033a2e',       // DestinationChatBubbleText
    ],
    SunsetTheme: [
      '#240B80',       // NavbarBG
      '#FF6B53',       // NavbarText
      '#A0086F',       // NavbarIcon
      '#ffffffc9',     // SecondaryColor , 
      sunset,       // PageBG  
      '#00CEC8',       // ButtonText
      '#F0687E',       // SideBarText
      '#B25291',       // SourceChatBubbleBG
        '#FFFFEF',        // SourceChatBubbleText
      '#110F36',       // DestinationChatBubbleBG
      '#875A79',       // DestinationChatBubbleText
    ]
  },

  SetTheme: async (season) => {
    try {
      let theme = ''

      if (season === 'moody') {
        theme = get().ThemeStates.MoodyTheme;
        
      }
      else if(season === 'dark'){
        theme = get().ThemeStates.DarkTheme;
        
      }
      else if(season === 'sunset'){
        theme = get().ThemeStates.SunsetTheme;
        
      }

      get().ApplyTheme(theme)
      get().UpdateState(season)
    } catch (error) {
      
    }
    
  },
  ApplyTheme: (theme) => {
    set({
        NavbarBG: theme[0],
        NavbarText: theme[1],
        NavbarIcon: theme[2],
        SecondaryColor: theme[3],
        PageBG: theme[4],
        ButtonText:theme[5],
        SideBarText:theme[6],
        SourceChatBubbleBG:theme[7],
        SourceChatBubbleText:theme[8],
        DestinationChatBubbleBG:theme[9],
        DestinationChatBubbleText:theme[10]
      });
  } ,
  LoadState : async() => {
    const res = await AxiosInstance.get('/api/users/get-theme')
    get().SetTheme(res.data.data)
  },
  UpdateState : async(theme) => {
    const res = await AxiosInstance.post('/api/users/update-theme' , {theme})
  }
}));

export default useTheme;
