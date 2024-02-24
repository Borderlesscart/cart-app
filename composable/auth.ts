import { baseApi } from "~/composable/endpoints";
import { API } from "./apiWrapper";

export const loginUser = async (data: any) => {
    console.log(data)
    const response = await API.post(baseApi.auth.login, data)
    console.log(response)   
    // return response
}