import { defineStore } from "pinia";
import { getDeliveryItems, storeBulkDeliveryItem, deleteUserDeliveryItem } from "~/composable/user";

export const userStore = defineStore('userStore',
    {
        state: () => {
            return  {
                deliveryItems: []
            }
        },
        actions: {
            async storeBulkDeliveryItem(data: any) {
                console.log(data)
                const storeItems = await storeBulkDeliveryItem(data)
                console.log('resoibse', storeItems)
                this.deliveryItems = storeItems?.data
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