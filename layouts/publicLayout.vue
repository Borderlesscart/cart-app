<template>
    <div class="w-11/12 sm:w-10/12 flex mx-auto mt-6 max-w-6xl">
        <div class="w-1/2">
            <NuxtLink to="/">
                <img :src="logoImg" class="w-9 h-11">
            </NuxtLink>          
        </div>  
    </div>
</template>
<script setup lang="ts">
import logoImg from '~/assets/img/logo.svg'
</script>