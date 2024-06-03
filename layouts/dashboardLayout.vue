<template>
     <div 
     class="w-11/12 sm:w-10/12 flex mx-auto mt-6 max-w-6xl"
     >
        <div class="w-1/2">
            <NuxtLink to="https://borderlesscart.com">
                <img :src="logoImg" class="w-9 h-11">
            </NuxtLink>
            
        </div>
        <div class="w-1/2 flex justify-end">
            <div class="notify-icon m-auto"> 
                <button @click="() => {
                    closeProfileDropDown()
                    showNotificationDropDown = !showNotificationDropDown
                }">
                    <img :src="notifyImg" class="w-4">
                </button>
                <div 
                v-if="showNotificationDropDown" 
                
                class="rounded bg-almost-dark px-4 py-2 flex flex-col text-right absolute top-14 right-28 md:right-60  sm:right-28 text-sm sm:text-base"
                >
                    <span class="mb-4 text-light-dark text-primary">0 Notification(s)</span>
                                        
                    <div @click="closeNotificationDropDown()" class="flex justify-end cursor-pointer">
                        <img :src="cancelImg" class="h-6"/>
                    </div>
                </div> 
            </div>
            <div class="flex flex-col font-inter">
                <div class="profile-icon flex justify-end">
                    <button @click="() => {
                        closeNotificationDropDown()
                        showProfileDropDown = !showProfileDropDown 
                    }">
                        <img :src="profileImg" class="w-10 h-10">
                    </button>      
                </div>
                <div 
                v-if="showProfileDropDown" 
                
                class="rounded bg-almost-dark px-4 py-2 flex flex-col text-right absolute top-16 right-4 sm:right-28 text-sm sm:text-base"
                >
                    <span class="mb-4 text-light-dark text-primary">{{ user?.first_name }} {{ user?.last_name }} </span>
                  
                        <button @click="routeTo('/dashboard/profile')">
                            <span class="text-off-white hover:text-primary">Account Details</span>
                        </button>
                    
                        <button @click="routeTo('/dashboard/profile?type=address')">
                            <span class="text-off-white hover:text-primary">Delivery Address</span>
                        </button>
                        
                    <span 
                        class="text-off-white cursor-pointer hover:text-primary"
                        @click="logOut()"
                    >Logout</span>
                    <div @click="closeProfileDropDown()" class="mt-4 flex justify-end cursor-pointer">
                        <img :src="cancelImg" class="h-6"/>
                    </div>
                </div>  
            </div>
            
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { onMounted, ref, toRefs} from 'vue';
    import cancelImg from '~/assets/img/cancel.svg'
    import profileImg from '~/assets/img/profile.svg'
    import notifyImg from '~/assets/img/notify.svg'
    import logoImg from '~/assets/img/logo.svg'

    const showProfileDropDown = ref(false)
    const showNotificationDropDown = ref(false)
    const user: any|undefined = useCookie('user')
    const jwtToken: any|undefined = useCookie('jwtToken')
    

    const logOut = () => {
        jwtToken.value = undefined
        user.value = undefined
        navigateTo('/auth/login')
    }

    const routeTo = (route: string) => {
        navigateTo(route)
        closeProfileDropDown()
    }

    const closeProfileDropDown = () => {
        if(showProfileDropDown.value){
            showProfileDropDown.value = false
        }
    }

    const closeNotificationDropDown = () => {
        if(showNotificationDropDown.value){
            showNotificationDropDown.value = false
        }
    }

    const vOnClickOutside = {
        mounted: function (element: any, binding: any) {
            element.clickOutsideEvent = function (event: any) {
            const excludeComponent = document.getElementById(binding.arg)

            if (
                !(element == event.target || element.contains(event.target)) &&
                !(
                excludeComponent &&
                (event.target == excludeComponent || excludeComponent.contains(event.target))
                )
            ) {
                binding.value(event, element)
            }
            }
            document.addEventListener('click', element.clickOutsideEvent)
        },
        unmounted: function (element: any) {
            document.removeEventListener('click', element.clickOutsideEvent)
        }
    }

</script>