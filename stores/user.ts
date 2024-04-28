import { defineStore } from "pinia";
import { getDeliveryItems, storeBulkDeliveryItem, deleteUserDeliveryItem, uploadDeliveryItem, deleteListItem, updateDeliveryItem, updateUserProfile, updateUserAddress } from "~/composable/user";

export const userStore = defineStore('userStore',
    {
        state: () => {
            return  {
                user: null,
                deliveryOptions: {},
                deliveryUploads: [],

                pendingDeliveries: [],
                newDeliveryItems: {
                    delivery: {
                        id: null
                    },
                    data: [{
                        name: '',
                        file: null,
                        id: null,
                        image_list_link: null
                    }]
                },
                viewDeliveryItems: {
                    delivery: {
                        id: null
                    },
                    data: [{
                        name: '',
                        file: null,
                        id: null,
                        image_list_link: null
                    }]
                },
            }
        },
        actions: {
            async storeBulkDeliveryItem(data: any) {
                const storeItems = await storeBulkDeliveryItem(data)
                return storeItems?.data
            },
            async uploadDeliveryItems(data: any){
                const uploadedItems = await uploadDeliveryItem(data)
                return uploadedItems.data
            },
            async getUserDeliveryItems(query: any){
                const deliveryListItems = await getDeliveryItems(query)
                this.pendingDeliveries = deliveryListItems?.data
            },
            async deleteUserDeliveryItem(id: any){
                await deleteUserDeliveryItem(id)
            },
            async deleteListItem(id: any): Promise<any>{
                return await deleteListItem(id)
            },
            async updateDeliveryItem(data: any): Promise<any>{
                return await updateDeliveryItem(data)
            },
            async updateUserProfile(data: any): Promise<any>{
                return await updateUserProfile(data)
            },
            async updateUserAddress(data: any): Promise<any>{
                return await updateUserAddress(data)
            }
        }
    }
)