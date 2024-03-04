<template>
     <div class="w-11/12 sm:w-10/12 flex mx-auto mt-6">
        <div class="w-1/2">
            <img src="img/logo.svg" class="w-9 h-11">
        </div>
        <div class="w-1/2 flex justify-end">
            <div class="notify-icon m-auto">
                <button @click="showNotificationDropDown = !showNotificationDropDown">
                    <img src="img/notify.svg" class="w-4">
                </button>
            </div>
            <div class="flex flex-col font-inter">
                <div class="profile-icon flex justify-end">
                    <button @click="showProfileDropDown = !showProfileDropDown">
                        <img src="img/profile.svg" class="w-10 h-10">
                    </button>      
                </div>
                <div v-if="showProfileDropDown" class="rounded bg-almost-dark px-4 py-2 flex flex-col text-right absolute top-16 right-4 sm:right-28 text-sm sm:text-base">
                    <span class="mb-4 text-light-dark text-primary">{{ user?.first_name }} {{ user?.last_name }} </span>

                    <NuxtLink to="#">
                        <span class="text-off-white hover:text-primary">View Settings</span>
                    </NuxtLink>
                    <span 
                        class="text-off-white cursor-pointer hover:text-primary"
                        @click="logOut()"
                    >Logout</span>
                    <div @click="closeNotificationDropDown()" class="mt-4 flex justify-end cursor-pointer">
                        <img src="img/cancel.svg" class="h-6"/>
                    </div>
                </div>  
            </div>
            
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { onMounted, ref, toRefs} from 'vue';


    const showProfileDropDown = ref(false)
    const showNotificationDropDown = ref(false)
    const user = useCookie('user')
    const jwtToken = useCookie('jwtToken')

    const logOut = () => {
        jwtToken.value = undefined
        user.value = undefined
        navigateTo('auth/login')
    }

    const closeNotificationDropDown = () => {
        showProfileDropDown.value = false
    }

</script>