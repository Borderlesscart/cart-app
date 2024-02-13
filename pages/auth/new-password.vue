<template>
    <NuxtLayout name="public-layout"></NuxtLayout>
    <div class="w-10/12 mx-auto mt-12">
        <div class="font-judson text-login-offwhite text-center text-2xl fon">
            <span>Enter your new password</span>
        </div>
    </div>

    <div class="flex flex-col items-center mt-10">
        <div class="sm:w-96 w-full mt-6">
                <GeneralPasswordInput
                  name="password" 
                  place-holder="New password" 
                  label-name="password"
                  :show-label="true"
            />
        </div>

        <div class="sm:w-96 w-full mt-2">
                <GeneralPasswordInput
                  name="confirm_password" 
                  place-holder="Confirm New password" 
                  label-name="confirm password"
                  :show-label="true"
            />
        </div>

        <div class="sm:w-96 w-full mt-6">
                <GeneralButton name="Reset Password" v-on:clicked=""/>
        </div>
    </div>
</template>