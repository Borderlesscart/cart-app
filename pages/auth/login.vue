<template>
    <div class="w-11/12 sm:w-10/12 flex mx-auto mt-6">
      <div class="w-1/2">
        <img src="/img/logo.svg" class="w-9 h-11">
      </div>
    </div>

    <div class="w-10/12 mx-auto mt-12">
        <div class="font-judson text-login-offwhite text-center text-2xl fon">
            <span>Welcome back 👋🏾</span>
        </div>

        <!-- <div class="border-b border-dark-grey mt-8 sm:w-96 w-full mx-auto"></div> -->
        <!-- Form input -->
        <div class="flex flex-col items-center mt-10">
            <div class="sm:w-96 w-full">
                <input 
                 class="font-inter rounded w-full bg-dark
                 outline-none focus:outline-input-borde  
                 py-2.5 px-2.5 text-md border border-input-border 
                 placeholder-input-placeholder text-input-placeholder
                 autofill:bg-dark " 
                 type="text" 
                 name="email" 
                 placeholder="email or phone"
                 autofocus
                >
            </div>

            <div class="sm:w-96 w-full mt-6">
                <input 
                 class="font-inter rounded w-full bg-dark
                 outline-none focus:outline-input-borde 
                 py-2.5 px-2.5 text-md border border-input-border 
                 placeholder-input-placeholder text-input-placeholder
                 autofill:bg-dark" 
                 type="password" 
                 name="password" 
                 placeholder="password"
                >
                <span class="float-right cursor-pointer relative bottom-8 right-4">
                    <img src="/img/eye.svg">
                </span>
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
                <button class="font-judson text-light-grey py-2.5 text-lg w-full bg-button-color rounded">
                    Login
                </button>
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