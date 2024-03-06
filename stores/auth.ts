import { defineStore } from "pinia";
import { loginUser, storeUserAuth, registerUser, sendOtp, verifyOtp,
        sendPasswordResetOtp, verifyPasswordReset, updatePassword 
    } from "~/composable/auth";
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
        },
        async register(data: any) {
            const request = await registerUser(data)

            // if(request?.code == 'ERR_BAD_REQUEST'){
            //     const message = request?.response?.data?.error
            //     if(message == 'Phone number already in use'){
            //         await sendOtp({'phone': data.phone})
            //         navigateTo('/auth/otp')
            //         const useNotification = useNotificationStore()
            //         useNotification.updateSuccess('Enter OTP sent to your phone for verifcation', false)
            //     }
            // }

            if(request?.data){
                await sendOtp({'phone': data.phone})
                navigateTo('/auth/otp')
                const useNotification = useNotificationStore()
                useNotification.updateSuccess('Enter OTP sent to your phone for verifcation', false)
            }
        },

        async sendOtp(data: any) {
            const request = await sendOtp(data)
            const useNotification = useNotificationStore()
            useNotification.updateSuccess('A new OTP has been sent', false)
        },

        async verifyOtp(data: {'phone': String, code: Number}) {
            const request = await verifyOtp(data)
            if(request?.data){
                const jwtToken = request?.data?.access_token
                const expires_in = request?.data?.expires
                const user = request?.data?.user
                storeUserAuth(jwtToken, expires_in, user)
                const useNotification = useNotificationStore()
                useNotification.updateSuccess('', false)
                navigateTo('/')
            }  
        },


        async sendPasswordResetOtp(data: {phone: string}) {
            const request = await sendPasswordResetOtp(data)
            if(request?.status === 'success'){
                navigateTo('/auth/otp?type=reset_password')
                const useNotification = useNotificationStore()
                useNotification.updateSuccess('Enter OTP sent to your phone for verifcation', false)
            }    
        },


        async verifyPasswordReset(data: {phone: string, code: number}) {
            const request = await verifyPasswordReset(data)
            if(request?.status === 'success'){
                if(request?.data){
                    const jwtToken = request?.data?.access_token
                    const expires_in = request?.data?.expires
                    const user = request?.data?.user
                    storeUserAuth(jwtToken, expires_in, user)
                    navigateTo('/auth/new-password')
                }   
            }

        },


        async updatePassword(data: {password: string, confirm_password: string}) {
            const request = await updatePassword(data)
            if(request?.status === 'success'){
                navigateTo('/')
            }

        }
    }   
})