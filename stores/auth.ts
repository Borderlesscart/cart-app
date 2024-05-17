import { defineStore } from "pinia";
import { loginUser, storeUserAuth, registerUser, sendOtp, verifyOtp,
        sendPasswordResetOtp, verifyPasswordReset, updatePassword, 
        verifyPasswordResetEmail, sendPasswordResetOtpEmail
    } from "~/composable/auth";
import { useNotificationStore } from "./notification";


export const useAuthStore = defineStore('authStore', {
    state: () => ({
        data: {}
    }),
    actions: {
        async  login(data: {user_id: string, password: string}) {
            try{
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
                    console.log(data.user_id)
                    localStorage.setItem('user_id', data.user_id)
                    storeUserAuth(jwtToken, expires_in, user)
                    navigateTo('/')
                }   
            }catch(error){
                throw error
            }     
        },
        async register(data: any) {
            try{
                const request = await registerUser(data)
                const useNotification = useNotificationStore()

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
                    const jwtToken = request?.data?.access_token
                    const expires_in = request?.data?.expires
                    const user = request?.data?.user
                    storeUserAuth(jwtToken, expires_in, user)
                    navigateTo('/')
                    useNotification.updateSuccess("<div class='flex flex-col'><span class='class='font-judson text-2xl''>👋🏾 Welcome aboard </span><span class='font-inter text-sm mt-2 text-left text-login-offwhite'>Copy shipping address, Send goods to copied address. List sent goods on deliveries page.</span></div>", false)
                }
            }catch(error){
                throw error
            }
            
        },

        async sendOtp(data: any) {
            const request = await sendOtp(data)
            const useNotification = useNotificationStore()
            useNotification.updateSuccess('A new OTP has been sent')
        },

        async sendOtpEmail(data: any) {
            const request = await this.sendPasswordResetOtpEmail(data)
            const useNotification = useNotificationStore()
            useNotification.updateSuccess('A new OTP has been sent')
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
            try{
                const request = await sendPasswordResetOtp(data)
                if(request?.status === 'success'){
                    navigateTo('/auth/otp?type=reset_password')
                    const useNotification = useNotificationStore()
                    useNotification.updateSuccess('Enter OTP sent to your phone for verifcation')
                }  
            }catch(error){
                throw error
            }
              
        },

        async sendPasswordResetOtpEmail(data: {email: string}) {
            try{
                const request = await sendPasswordResetOtpEmail(data)
                if(request?.status === 'success'){
                    navigateTo('/auth/otp?type=reset_password&mode=email')
                    const useNotification = useNotificationStore()
                    useNotification.updateSuccess('Enter OTP sent to your email for verification')
                }    
            }catch(error){
                throw error
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

        async verifyPasswordResetEmail(data: {email: string, code: number}) {
            const request = await verifyPasswordResetEmail(data)
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
            try{
                const request = await updatePassword(data)
                if(request?.status === 'success'){
                    // const jwtToken = request?.data?.access_token
                    // const expires_in = request?.data?.expires
                    // const user = request?.data?.user
                    // storeUserAuth(jwtToken, expires_in, user)
                    navigateTo('/')

                }
            }catch(error){
                throw error
            }
        }
    }   
})