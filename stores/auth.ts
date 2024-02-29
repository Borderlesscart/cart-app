import { defineStore } from "pinia";
import { loginUser, storeUserAuth } from "~/composable/auth";
import { useNotificationStore } from "./notification";


export const useAuthStore = defineStore('authStore', {
    state: () => ({
        data: {}
    }),
    actions: {
        async login(data: {user_id: string, password: string}) {
            const request = await loginUser(data)
            
            if(request.status === 'error'){
                const useNotification = useNotificationStore()
                useNotification.updateError(request.message)
                return
            }

            if(request?.data){
                const jwtToken = request?.data?.access_token
                const expires_in = request?.data?.expires
                const user = request?.data?.user
                storeUserAuth(jwtToken, expires_in, user)
                navigateTo('/')
            }
           
        }
    }   
})