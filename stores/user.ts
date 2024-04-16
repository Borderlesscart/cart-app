import { defineStore } from "pinia";
import { getDeliveryItems, storeBulkDeliveryItem, deleteUserDeliveryItem, uploadDeliveryItem } from "~/composable/user";

export const userStore = defineStore('userStore',
    {
        state: () => {
            return  {
                deliveryOptions: {},
                deliveryItems: [],
                deliveryUploads: []
            }
        },
        actions: {
            async storeBulkDeliveryItem(data: any) {
                const storeItems = await storeBulkDeliveryItem(data)
                console.log('deliveryItems', storeItems)
                this.deliveryItems = storeItems?.data
            },
            async uploadDeliveryItems(data: any){
                const uploadedItems = await uploadDeliveryItem(data)
                console.log('uploadItems', uploadedItems)
                this.deliveryUploads = uploadedItems?.data
            },
            async getUserDeliveryItems(query: any){
                const deliveryListItems = await getDeliveryItems(query)
                this.deliveryItems = deliveryListItems?.data
            },
            async deleteUserDeliveryItem(id: any){
                await deleteUserDeliveryItem(id)
            }       
        }
    }
)