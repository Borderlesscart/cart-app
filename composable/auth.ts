import { baseApi } from "~/composable/endpoints";
import { API } from "./apiWrapper";

export const loginUser = async (data: any): Promise<any> => {
   return await API.post(baseApi.auth.login(), data)
}

export const registerUser = async (data: any): Promise<any> => {
    return await API.post(baseApi.auth.register(), data)
}

export const sendOtp = async (data: {phone: string}): Promise<any> => {
    const phone = useCookie('phone')
    phone.value = data.phone
    return await API.post(baseApi.auth.otp(), data)
}

export const verifyOtp = async (data: {'phone': String, code: Number}): Promise<any> => {
    return await API.post(baseApi.auth.verify_otp(), data)
}

export const sendPasswordResetOtp = async (data: {phone: string}): Promise<any> => {
    const phone = useCookie('phone')
    phone.value = data.phone
    return await API.post(baseApi.auth.forgot_password(), data)
}

export const sendPasswordResetOtpEmail = async (data: {email: string}): Promise<any> => {
    const email = useCookie('email')
    email.value = data.email
    return await API.post(baseApi.auth.forgot_password_email(), data)
}

export const verifyPasswordReset = async (data: {phone: string, code: number}): Promise<any> => {
    return await API.post(baseApi.auth.verify_password_reset(), data)
}

export const verifyPasswordResetEmail = async (data: {email: string, code: number}): Promise<any> => {
    return await API.post(baseApi.auth.verify_password_reset_email(), data)
}

export const updatePassword = async (data: {password: string, confirm_password: string}): Promise<any> => {
    const response = await API.put(baseApi.auth.update_password(), data)
    return response
}


export const storeUserAuth = async (access_token: string, expires_in: string, user: any) => {
    const maxAge = parseInt(expires_in) * 60
    const jwtToken = useCookie('jwtToken')
    jwtToken.value = JSON.stringify({
        access_token, 
        expires_in: maxAge
    })
    const authUser = useCookie('user')  
    authUser.value = JSON.stringify(user)
}