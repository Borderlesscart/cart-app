import { defineStore } from "pinia";
import { getDeliveryItems, storeBulkDeliveryItem, deleteUserDeliveryItem, uploadDeliveryItem } from "~/composable/user";

export const userStore = defineStore('userStore',
    {
        state: () => {
            return  {
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
                        id: null
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
            }       
        }
    }
)