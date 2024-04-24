import { baseApi } from "~/composable/endpoints";
import { API } from "./apiWrapper";

export const storeBulkDeliveryItem = async (data: any): Promise<any> => {
    return await API.post(baseApi.user.storeBulkDeliveryItem(), data)
}

export const getDeliveryItems = async (query: any): Promise<any> => {
    return await API.get(baseApi.user.getDeliveryListItems(), 
    {
        params:query
    })
}

export const uploadDeliveryItem = async (data: any): Promise<any> => {
    return await API.post(baseApi.user.uploadDeliveryItem(), data, {headers: { "Content-Type": "multipart/form-data" }})
}

export const deleteUserDeliveryItem = async (id: any): Promise<any> => {
    return await API.delete(baseApi.user.deleteDeliveryItem(id))
}

export const deleteListItem = async (id: any): Promise<any> => {
    return await API.delete(baseApi.user.deleteListItem(id))
}

export const updateDeliveryItem = async (data: any): Promise<any> => {
    return await API.put(baseApi.user.updateDeliveryItem(), data)
}