<template>
    <NuxtLayout name="public-layout"></NuxtLayout>
    <div class="w-10/12 mx-auto mt-12">
        <div class="font-judson text-login-offwhite text-center text-2xl fon">
            <span>Forgot password?</span>
        </div>

        <div class="flex flex-col items-center mt-10">
        <div class="sm:w-96 w-full mt-6">
                <GeneralPasswordInput
                  name="phone" 
                  place-holder="09023548503" 
                  label-name="phone"
                  :show-label="true"
            />
        </div>

        <div class="sm:w-96 w-full mt-2">
                <GeneralButton name="Change password" v-on:clicked=""/>
        </div>
        </div>

    </div>
    

    
</template>