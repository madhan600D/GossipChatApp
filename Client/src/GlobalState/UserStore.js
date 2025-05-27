import { create } from 'zustand';
import AxiosInstance from '../Lib/AxiosInstance.js';
import showToast from '../Components/Toast/Toast.js';
import {io} from 'socket.io-client'
import { UseChat } from './ChatStore.js';
const ServerURL = import.meta.env.MODE === 'development' ? 'http://localhost:5000/' : '/' ;
const useUser = create((set ,get) => ({
    UserValidity:null,
    User:null,
    isLoading:false,
    isUploadingImage:false,
    SocketState : null,
    OnlineUsers:[],
    checkAuth: async () => {
        set({isLoading:true})
        try {
            const res  = await AxiosInstance.get('/api/users/validate-user');
            set({
                User: {
                    _id: res.data.data._id,
                    UserName: res.data.data.UserName, 
                    ProfilePic: res.data.data.ProfilePic
                }
                });
            const Valid = await res.data.success;
            // if(get().SocketState.connected ==- false){
            if (!get().SocketState?.connected) 
            {

            await get().ConnectSocket();

            }            
            set({ UserValidity: Valid });
            showToast(Valid , true)

        } catch (error) {
            console.log(error)
            showToast(error , false)
        }
        finally{
            set({isLoading:false})
        }
        
    },
    Signup: async (parm) => {
    try {

        const res = await AxiosInstance.put('/api/users/signup' , parm);
        const DataFromServer =  res.data.data;

        showToast(DataFromServer.message , true)
        return DataFromServer
    } catch (error) {
        showToast(error.response.data.message , false)
    }
    },
    logout: async () => {
        set({isLoading:false})
    try {
        
        const res = await AxiosInstance.put('/api/users/logout');
        const DataFromServer =  res.data;
        get().DisconnectSocket();
        //Clear all variables 

        set
        ({
            UserValidity:null,
            User:null,
            SocketState : null,
            OnlineUsers:[]
        })

        //Clear ChatStore Variables
        UseChat.getState().ClearChatStore()
        showToast(DataFromServer.message , true)

        return DataFromServer
    } catch (error) {
        showToast(error.response.data.message , false)
    }
    finally{
        set({isLoading:false})
    }
    },
    signin:async (parm) => {

        try {
            const res = await AxiosInstance.put('/api/users/login' , parm)
            const DataFromServer = await res.data
            set({ UserValidity: DataFromServer.success });
            set({USer:get().checkAuth()})
            await get().ConnectSocket()
            showToast(DataFromServer.message , true)
        } catch (error) {
            showToast(error.response.data.message , false)
        }
    },
    EditProfile: async (parm) => {
        set({isUploadingImage:true})
        try {
           
           const res = await AxiosInstance.patch('/api/users/update-profile', { base64: parm },

            {
                headers:{
                    'Content-Type':'application/json',
                }
            }
           )
           const DataFromServer = await res.data
           
           set({
                User: {
                
                    ProfilePic: res.data.data.ProfilePic
                }
                });
            showToast("Profile pic updated Successfully" , true)
        } catch (error) {
            showToast(error , false)
        }
        finally{
            set({isUploadingImage:false})
        }
    },
    ConnectSocket:  () => {
        //Validate user and connect 
        try {
            const {User} = get();
            if(!User || get().SocketState?.connected) return ;

            const Socket = io(ServerURL , {
                //Pass user ID 
                query:{
                    ID:User._id
                }
            });
            
            Socket.connect()
            //Initializing a socket listeners for onlineUsers Event 
            set({SocketState:Socket});
            Socket.on("OnlineUsers" , (UserIDs) => {
                set({ OnlineUsers: UserIDs });   

            })

        } catch (error) {
            
        }
        
    },
    DisconnectSocket:() => {
        if(get().SocketState?.connected){
             get().SocketState.disconnect();
             set({SocketState:null})
        }
    }
}))

export default useUser