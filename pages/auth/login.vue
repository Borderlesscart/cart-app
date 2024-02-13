<template>
    <NuxtLayout name="public-layout"></NuxtLayout>

    <div class="w-10/12 mx-auto mt-12">
        <div class="font-judson text-login-offwhite text-center text-2xl fon">
            <span>Welcome back 👋🏾</span>
        </div>

        <!-- <div class="border-b border-dark-grey mt-8 sm:w-96 w-full mx-auto"></div> -->
        <!-- Form input -->
        <div class="flex flex-col items-center mt-10">
            <div class="sm:w-96 w-full">
                <GeneralTextInput type="text" name="email" place-holder="email or phone" :auto-focus="true"/>
            </div>

            <div class="sm:w-96 w-full mt-6">
                <GeneralPasswordInput
                  name="password" 
                  place-holder="password" 
                  label-name="password"
            />
            </div>

            <div class="sm:w-96 w-full mt-6 font-inter text-xs flex justify-between text-login-grey">
                <div>
                    <!-- <input
                    type="checkbox"
                    name="remember"
                    id="remember"
                    class="mr-2 cursor-pointer bg-dark"
                    >
                    <label for="remember">Remember Me</label> -->
                </div>
                
                <NuxtLink to="#" class="hover:text-input-placeholder">
                    Forgot Password?
                </NuxtLink>
            </div>
            <div class="sm:w-96 w-full mt-6">
                <GeneralButton name="Login"/>
            </div>

            <div class="sm:w-96 w-full mt-4 font-inter text-sm flex justify-between ">
                <div class="text-input-placeholder">
                   <span>Don't have an account yet?</span>
                </div>
                
                <NuxtLink to="/auth/register" class="hover:button-color text-primary">
                    Sign Up
                </NuxtLink>
            </div>
        </div>

    </div>

</template>

<style scoped>
    input:-internal-autofill-selected {
        background-color: #1E1E1E !important;
    }
</style>