<template>
    <NuxtLayout name="public-layout"></NuxtLayout>

    <div class="w-10/12 mx-auto mt-8">
        <div class="font-judson text-login-offwhite text-center text-2xl">
            <span>Create account</span>
        </div>

        <div class="flex flex-col items-center mt-6">
          <div class="sm:w-96 w-full flex justify-between">
            <div class="w-5/12">
                <GeneralTextInput 
                  type="text"
                  name="first_name" 
                  place-holder="John" 
                  :auto-focus="true"
                  :show-label="true"
                  label-name="First name"
                />
            </div>

            <div class="w-5/12">
              <GeneralTextInput 
                  type="text"
                  name="last_name" 
                  place-holder="Doe" 
                  :show-label="true"
                  label-name="Last name"
                />
            </div>       
          </div>

          <div class="sm:w-96 w-full mt-4">
                <GeneralTextInput 
                  type="text"
                  name="phone" 
                  place-holder="09023548503" 
                  :show-label="true"
                  label-name="phone"
                />
          </div>

          <div class="sm:w-96 w-full mt-4">
              <GeneralTextInput 
                  type="email"
                  name="email" 
                  place-holder="johndoe@gmail.com" 
                  :show-label="true"
                  label-name="email"
                />
          </div>

          <div class="sm:w-96 w-full mt-6">
            <GeneralPasswordInput
                  name="password" 
                  place-holder="password" 
                  :show-label="true"
                  label-name="password"
            />
          </div>
          <div class="text-xs font-inter text-login-offwhite sm:w-96 w-full mt-2">
            <span>By signing up, I agree with borderless cart's 
              <NuxtLink to="#" class="text-primary">user agreement</NuxtLink>
              and 
              <NuxtLink to="#" class="text-primary">privacy policy</NuxtLink></span>
          </div>

          <div class="sm:w-96 w-full mt-4">
                <GeneralButton name="Sign up"/>
          </div>

          <div class="sm:w-96 w-full mt-4 font-inter text-sm flex justify-between ">
                <div class="text-input-placeholder">
                   <span>Already have an account?</span>
                </div>
                
                <NuxtLink to="/auth/login" class="hover:button-color text-primary">
                    Login
                </NuxtLink>
            </div>
        </div>
    </div>

    
</template>