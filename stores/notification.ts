import { defineStore } from "pinia";

export const useNotificationStore = defineStore('notficationStore', {
    state: () => ({
        error: {
            message: '',
            flash: true
        },
        success: {
            message: '',
            flash: true
        }
    }),
    actions: {
        updateError(message: string, flash: boolean|null = null) {
            this.error.message = message

            if(flash !== null){
                this.error.flash = flash
            }       
        },
        updateSuccess(message: string, flash: boolean|null = null) {
            this.success.message = message
            if(flash !== null){
                this.success.flash = flash
            }       
        },
    }
})