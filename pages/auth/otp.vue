<template>
      <NuxtLayout name="public-layout"></NuxtLayout>
    <div class="w-10/12 mx-auto mt-12">
        <div class="font-judson text-login-offwhite text-center text-2xl fon">
            <span>Enter Your One time password</span>
        </div>

        <div class="flex flex-col items-center mt-10">
            <div class="sm:w-96 w-full mt-6">
                    <GeneralTextInput
                    name="otp" 
                    place-holder="Enter otp to reset password" 
                    label-name="One time password"
                    :show-label="true"
                />
            </div>

            <div class="sm:w-96 w-full mt-6">
                    <GeneralButton name="Submit" v-on:clicked=""/>
            </div>
         </div>
    </div>
    
</template>