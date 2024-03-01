import { baseApi } from "~/composable/endpoints";
import { API } from "./apiWrapper";

export const loginUser = async (data: any): Promise<any> => {
   return await API.post(baseApi.auth.login, data)
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