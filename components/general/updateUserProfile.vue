<template>
    <div class="w-10/12 mx-auto pb-6">


        <div class="text-base  text-login-offwhite">
            <span>Account Details</span>
        </div>

        <div class="flex flex-col items-center mt-4">
          <form>
            <div class="sm:w-96 w-full flex justify-between">
              
              <div class="w-5/12">
                  <GeneralTextInput 
                    type="text"
                    name="first_name" 
                    place-holder="John" 

                    :show-label="true"
                    label-name="First name"
                    :value="data.first_name"
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
                    :value="data.last_name"
                    @input="value => data.last_name = value"
                    @valid="value => validateFormInput(value, 'last_name')"
                  />
              </div>       
            </div>

            <div class="sm:w-96 w-full ">
                  <GeneralTextInput 
                    type="text"
                    name="phone" 
                    place-holder="09023548503" 
                    :show-label="true"
                    label-name="phone"
                    :value="data.phone"
                    @input="value => data.phone = value"
                    @valid="value => validateFormInput(value, 'phone')"
                  />             
                    <!--  v-if="!data.phone_verified" -->
                  <button class="text-primary text-sm relative bottom-4 float-right">Verify Phone</button>
            </div>

            <div class="sm:w-96 w-full ">
                <GeneralTextInput 
                    type="email"
                    name="email" 
                    place-holder="johndoe@gmail.com" 
                    :show-label="true"
                    label-name="email"
                    :value="data.email"
                    @input="value => data.email = value"
                    @valid="value => validateFormInput(value, 'email')"
                  />
            </div>

            <div class="sm:w-96 w-full flex justify-between">
              
              <div class="w-5/12">
                  <GeneralTextInput 
                    type="text"
                    name="bvn" 
                    place-holder="23232324342" 
                    :show-label="true"
                    label-name="BVN"
                    :value="data.bvn"
                    @input="value => data.bvn = value"
                    @valid="value => validateFormInput(value, 'bvn')"
                  />
              </div>

              <div class="w-5/12">
                <GeneralTextInput 
                    type="date"
                    name="dob" 
                    place-holder="06/03/2001" 
                    :show-label="true"
                    label-name="Date of Birth"
                    :value="data.dob"
                    @input="value => {
                        data.dob = value
                        console.log(data.dob)
                    }"
                    @valid="value => validateFormInput(value, 'dob')"
                  />
              </div>       
            </div>

            <div class="flex w-full justify-between items-center">
                <span class=" border-b border-dark-grey w-2/5"></span>
                <span class="text-sm text-login-offwhite  w-1/5 text-center">optional</span>
                <span class=" border-b border-dark-grey  w-2/5"></span>
            </div>

            <div class="sm:w-96 w-full">
              <GeneralPasswordInput
                    name="old_password" 
                    place-holder="Old password" 
                    :show-label="true"
                    :optional="true"
                    label-name="old password"
                    @input="value => data.old_password = value"
                    @valid="value => validateFormInput(value, 'old_password')"
              />
            </div>

            <div class="sm:w-96 w-full">
              <GeneralPasswordInput
                    name="password" 
                    place-holder="New Password" 
                    :show-label="true"
                    :optional="true"
                    label-name="New password"
                    @input="value => data.password = value"
                    @valid="value => validateFormInput(value, 'password')"
              />
            </div>

            <div class="sm:w-96 w-full mt-2">
                  <GeneralButton 
                      :name="formSubmitting?'Saving...':isFormDirty? 'Save': 'Saved'" 
                      @clicked="updateUserProfile(data)"
                      :disabled="validFormFields.length !== formFields || isFormDirty?true:false || formSubmitting"
                  />
            </div>
          </form>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { ref, onMounted, onBeforeMount } from 'vue'

    const data = ref<any>({
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      bvn: '',
      dob: '',
      old_password: '',
      password: '',
      email_verified: false,
      phone_verified: false
   })


   const formFields = ref(Object.keys(data.value).length - 4) //since the password fields are optional and two fields aren't used on the form
   const validFormFields = ref<string[]>([])
   const formSubmitting = ref(false)
   const isFormDirty = ref(false)

   onBeforeMount(() => {
        const user = useCookie('user')
        const jwtToken = useCookie('jwtToken')
        if(!jwtToken.value || !user.value){
        navigateTo('auth/login')
      }

      const formFields = Object.keys(data.value)
      data.value = user.value

      for(const [key, value] of Object.entries(data.value)){
        if(
            key !== 'email_verified' && 
            key !== 'phone_verified' &&
            formFields.includes(key)
        )
        {
            let curr: any =value
            if(curr && curr.length > 3){
                console.log(curr)
                validateFormInput(true, key)
            }
        }
        
      }

   })

   const validateFormInput = (valid: boolean, formInput: string) => {
      if(valid){
            if(!validFormFields.value.includes(formInput)){
                validFormFields.value.push(formInput)
            }    
            isFormDirty.value = true    
        }else{
            validFormFields.value = validFormFields.value.filter(validFormField => validFormField !== formInput)
      }
   }

   const updateUserProfile = (data: any) => {
    console.log(data)
   }
</script>