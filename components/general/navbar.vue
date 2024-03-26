<template>
     <!-- Nav bar -->
     <div class="max-w-6xl w-10/12 border-b border-dark-grey flex mt-16 m-auto text-off-white justify-between sm:justify-around sm:text-base text-sm">
        <div 
            v-for="navRoute in navRoutes" 
            class="cursor-pointer font-inter"
            :class="$route.path === navRoute.link?'primary-color border-b primary-color-border':''"
        >
            <NuxtLink :to="navRoute.link">
                {{ navRoute.name }}
            </NuxtLink>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { ref } from 'vue'

    const navRoutes = [
        {
            name: 'Get shipping addres',
            link: '/'
        },
        {
            name: 'Deliveries',
            link: '/dashboard/deliveries'
        }
    ]
</script>