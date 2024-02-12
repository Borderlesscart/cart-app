<template>
    <div class="w-11/12 sm:w-10/12 flex mx-auto mt-6">
      <div class="w-1/2">
        <img src="/img/logo.svg" class="w-9 h-11">
      </div>
    </div>

    <div class="w-10/12 mx-auto mt-12">
        <div class="font-judson text-login-offwhite text-center text-2xl fon">
            <span>Create account</span>
        </div>

        <div class="flex flex-col items-center mt-10">
          <div class="sm:w-96 w-full flex justify-between">
            <div class="w-5/12">
              <label for="first_name" class="font-inter text-login-offwhite text-xs">First name*</label>
              <input 
                  class="font-inter rounded w-full bg-dark
                  outline-none focus:outline-input-borde  
                  py-2.5 px-2.5 text-md border border-input-border 
                  placeholder-dark-grey text-input-placeholder
                  autofill:bg-dark " 
                  type="text" 
                  name="first_name" 
                  placeholder="John"
                  id="first_name"
                  autofocus
                >
            </div>

            <div class="w-5/12">
              <label for="last_name" class="font-inter text-login-offwhite text-xs">Last name*</label>
              <input 
                  class="font-inter rounded w-full bg-dark
                  outline-none focus:outline-input-borde  
                  py-2.5 px-2.5 text-md border border-input-border 
                  placeholder-dark-grey text-input-placeholder
                  autofill:bg-dark " 
                  type="text" 
                  name="last_name" 
                  placeholder="Doe"
                  id="last_name"
                >
            </div>       
          </div>

          <div class="sm:w-96 w-full mt-4">
            <label for="phone" class="font-inter text-login-offwhite text-xs">phone*</label>
              <input 
                  class="font-inter rounded w-full bg-dark
                  outline-none focus:outline-input-borde  
                  py-2.5 px-2.5 text-md border border-input-border 
                  placeholder-dark-grey text-input-placeholder
                  autofill:bg-dark " 
                  type="text" 
                  name="phone" 
                  placeholder="09023548503"
                  id="phone"
                >
          </div>

          <div class="sm:w-96 w-full mt-4">
            <label for="email" class="font-inter text-login-offwhite text-xs">email*</label>
              <input 
                  class="font-inter rounded w-full bg-dark
                  outline-none focus:outline-input-borde  
                  py-2.5 px-2.5 text-md border border-input-border 
                  placeholder-dark-grey text-input-placeholder
                  autofill:bg-dark" 
                  type="email" 
                  name="email" 
                  placeholder="johndoe@gmail.com"
                  id="email"
              >
          </div>

          <div class="sm:w-96 w-full mt-6">
            <label for="email" class="font-inter text-login-offwhite text-xs">password*</label>
                <input 
                 class="font-inter rounded w-full bg-dark
                 outline-none focus:outline-input-borde 
                 py-2.5 px-2.5 text-md border border-input-border 
                 placeholder-dark-grey text-input-placeholder
                 autofill:bg-dark" 
                 type="password" 
                 name="password" 
                 placeholder="password"
                 id="password"
                >
                <span class="float-right cursor-pointer relative bottom-8 right-4">
                    <img src="/img/eye.svg">
                </span>
          </div>
        </div>
    </div>

    
</template>