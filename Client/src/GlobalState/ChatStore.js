import showToast from "../Components/Toast/Toast";
import useTheme from "./ThemeStore";
import { create } from "zustand";
import AxiosInstance from "../Lib/AxiosInstance";
import useUser from '../GlobalState/UserStore'

export const UseChat = create((set , get) => ({
    SelectedUser:{id:'' , UserName:'' , ProfilePic:''},
    AllUsers:[],
    Messages:[],
    isMessagesSending:false,
    isUsersLoading:false,
    isMessagesLoading:false,
    LoadUsers: async () => {
        set({isUsersLoading:true})
        try {
            const res = await AxiosInstance.get(`/messages/`)
            const DataFromServer = res.data.data;
            set({AllUsers:DataFromServer})
        } catch (error) {
            console.log("Error in obtaining user(ChatStore)" , error)
            showToast("error" , false)
        }
        finally{
            set({isUsersLoading:false})
        }
    },
    LoadMessages: async (id) => {
        set({isMessagesLoading:true})
        try {
            if(!id){
                return 
            }
            const res =  await AxiosInstance.get(`/messages/${id}`)
            const DataFromServer = res.data.data || '';
            set({Messages:DataFromServer})
        } catch (error) {
            console.log("Error in obtaining Messages(Chat Store)" , error)
            showToast(error , false)
        }
        finally{
            set({isMessagesLoading:false})
        }
    },
    setSelectedUser: (parm) => set({SelectedUser:parm}),
    SendMessage : async (id , data) => {
        set({isMessagesSending:true})
        try {
            
            const res = await AxiosInstance.put(`/messages/${id}` ,data)
            const DataFromServer = res.data;
            set({Messages: [...get().Messages , DataFromServer.data]})
            
        } catch (error) {
            showToast(error , false)
        }
        finally{
            set({isMessagesSending:false});
        }
    },
    ListenMessages: () => {
        //Initialize connection only if there is auser selected
        if(get().SelectedUser.id){
            const socket = useUser.getState().SocketState;
            socket.on("SendMessage" , (IncomingMessage) => {
                set({Messages:[...get().Messages , IncomingMessage]})
            })
        }
    },
    UnListenMessages: () => {
        const socket = useUser.getState().SocketState;
        if(!socket) return;
        socket.off();

    },
    ClearChatStore: async () => {
        set
        ({
            SelectedUser:{id:'' , UserName:'' , ProfilePic:''},
            AllUsers:[],
            Messages:[]
        })
    }
}))