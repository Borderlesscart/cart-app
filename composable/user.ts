import { baseApi } from "~/composable/endpoints";
import { API } from "./apiWrapper";

export const storeBulkDeliveryItem = async (data: any): Promise<any> => {
    return await API.post(baseApi.user.storeBulkDeliveryItem(), data)
}

export const getDeliveryItems = async (query: any): Promise<any> => {
    return await API.get(baseApi.user.getDeliveryListItems(), 
    {
        params:query
    }
    )
}