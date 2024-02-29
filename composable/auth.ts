import { baseApi } from "~/composable/endpoints";
import { API } from "./apiWrapper";

export const loginUser = async (data: any): Promise<any> => {
   return await API.post(baseApi.auth.login, data)
}

export const storeUserAuth = async (access_token: string, expires_in: string, user: any) => {
    const maxAge = parseInt(expires_in) * 60
    const jwtToken = useCookie('jwtToken', {
        httpOnly: true,
        maxAge: maxAge
    })
    jwtToken.value = access_token
    const authUser = useCookie('user', {
        httpOnly: true,
        maxAge: maxAge
    })  
    authUser.value = JSON.stringify(user)
}