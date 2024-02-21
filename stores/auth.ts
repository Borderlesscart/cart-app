import { defineStore } from "pinia";
import { loginUser } from "~/composable/auth";
import authService from "~/services/auth.service"

export const useAuthStore = defineStore('authStore', {
    state: () => ({
        data: {}
    }),
    actions: {
        async login(data: {user_id: string, password: string}) {
            const request = await loginUser(data)  
        }
    }   
})