<template>
    <NuxtLayout name="public-layout"></NuxtLayout>

    <div class="w-10/12 mx-auto mt-8 pb-6">
        <div class="font-judson text-login-offwhite text-center text-2xl">
            <span>Create account</span>
        </div>

        <div class="flex flex-col items-center mt-6">
          <form>
            <div class="sm:w-96 w-full flex justify-between">
              
              <div class="w-5/12">
                  <GeneralTextInput 
                    type="text"
                    name="first_name" 
                    place-holder="John" 
                    :auto-focus="true"
                    :show-label="true"
                    label-name="First name"
                    @input="value => data.first_name = value"
                    @valid="value => validateFormInput(value, 'first_name')"
                  />
              </div>

              <div class="w-5/12">
                <GeneralTextInput 
                    type="text"
                    name="last_name" 
                    place-holder="Doe" 
                    :show-label="true"
                    label-name="Last name"
                    @input="value => data.last_name = value"
                    @valid="value => validateFormInput(value, 'last_name')"
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
                    @input="value => data.phone = value"
                    @valid="value => validateFormInput(value, 'phone')"
                  />
            </div>

            <div class="sm:w-96 w-full mt-4">
                <GeneralTextInput 
                    type="email"
                    name="email" 
                    place-holder="johndoe@gmail.com" 
                    :show-label="true"
                    label-name="email"
                    @input="value => data.email = value"
                    @valid="value => validateFormInput(value, 'email')"
                  />
            </div>

            <div class="sm:w-96 w-full mt-6">
              <GeneralPasswordInput
                    name="password" 
                    place-holder="password" 
                    :show-label="true"
                    label-name="password"
                    @input="value => data.password = value"
                    @valid="value => validateFormInput(value, 'password')"
              />
            </div>
            <div class="text-xs font-inter text-login-offwhite sm:w-96 w-full mt-2">
              <span>By signing up, I agree with borderless cart's 
                <NuxtLink to="#" class="text-primary">user agreement</NuxtLink>
                and 
                <NuxtLink to="#" class="text-primary">privacy policy</NuxtLink></span>
            </div>

            <div class="sm:w-96 w-full mt-4">
                  <GeneralButton 
                      :name="formSubmitting?'Loading...':'Sign up'" 
                      @clicked="signUpUser(data)"
                      :disabled="validFormFields.length !== formFields || formSubmitting"
                  />
            </div>

            <div class="sm:w-96 w-full mt-4 font-inter text-sm flex justify-between ">
                  <div class="text-input-placeholder">
                    <span>Already have an account?</span>
                  </div>
                  
                  <NuxtLink to="/auth/login" class="hover:button-color text-primary">
                      Login
                  </NuxtLink>
             </div>
          </form>
        </div>
    </div>
</template>
<script setup lang="ts">
   import { ref } from 'vue';
   const data = ref({
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      password: ''
   })

   const formFields = ref(Object.keys(data.value).length)
   const validFormFields = ref<string[]>([])
   const formSubmitting = ref(false)

   const authStore = useAuthStore()

   const validateFormInput = (valid: boolean, formInput: string) => {
      if(valid){
            if(!validFormFields.value.includes(formInput)){
                validFormFields.value.push(formInput)
            }        
        }else{
            validFormFields.value = validFormFields.value.filter(validFormField => validFormField !== formInput)
      }
   }

   const signUpUser = async (data: any) => {
      formSubmitting.value = true
      await authStore.register(data)
      formSubmitting.value = false
   }
</script>