<template>
    <div class="success-component absolute bottom-12 rounded mt-4 px-6 py-3 text-base  font-inter bg-light-dark flex justify-between">
        <div class="flex flex-col">
            <span class="font-judson text-l">👋🏾 Add your shipping address <NuxtLink to='/dashboard/profile?type=address' class='text-primary cursor-pointer'>here</NuxtLink></span>
            <span class='font-inter text-sm mt-2 text-center text-login-offwhite'>We will send your items to this address</span>
         </div>
        <button @click="clearMessage()">
            <img :src="cancelImg" class="h-6 w-6"/>
        </button>
    </div>
    
</template>
<script setup lang="ts">
    import { ref } from 'vue'
    import cancelImg from '~/assets/img/cancel.svg'

    const userProfileStore = userStore()
    const clearMessage = () => {
        userProfileStore.updateAddShippingAddressNotification(false)
    }
</script>
<style scoped>
    .success-component {
        box-shadow: #00b39f 0.3px -0.8px 5px;
        color: #d1d1d1;
    }
</style>