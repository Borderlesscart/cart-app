import { baseApi } from "~/composable/endpoints";
import { API } from "./apiWrapper";

export const loginUser = async (data: any): Promise<any> => {
   return await API.post(baseApi.auth.login, data)
}

export const registerUser = async (data: any): Promise<any> => {
    return await API.post(baseApi.auth.register, data)
}

export const sendOtp = async (data: any): Promise<any> => {
    const phone = useCookie('phone')
    phone.value = data.phone
    return await API.post(baseApi.auth.otp, data)
}

export const verifyOtp = async (data: {'phone': String, code: Number}): Promise<any> => {
    return await API.post(baseApi.auth.verify_otp, data)
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