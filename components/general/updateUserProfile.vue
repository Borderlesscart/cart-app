<template>
    <div class="w-10/12 mx-auto pb-6  max-w-6xl">
        <div class="text-base  text-login-offwhite">
            <span>Account Details</span>
        </div>

        <div class="flex flex-col items-center mt-4">
    
            <div class="sm:w-96 w-full flex justify-between">
              
              <div class="w-5/12">
                  <GeneralTextInput 
                    type="text"
                    name="first_name" 
                    place-holder="John" 
                    :show-label="true"
                    label-name="First name"
                    :value="data.first_name"
                    @input="value => {
                        data.first_name = value
                        isFormDirty = true  
                    }"
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
                    @input="value => {
                        data.last_name = value
                        isFormDirty = true  
                    }"
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
                    @input="value => {
                        data.phone = value
                        isFormDirty = true  
                    }"
                    @valid="value => validateFormInput(value, 'phone')"
                  />             
                    <!--  v-if="!data.phone_verified" -->
                  <button 
                    v-if="!data.phone_verified"
                    @click="verifyPhone()"
                    class="text-primary text-sm relative bottom-4 float-right"
                  >
                  Verify Phone
                </button>
            </div>

            <div class="sm:w-96 w-full ">
                <GeneralTextInput 
                    type="email"
                    name="email" 
                    place-holder="johndoe@gmail.com" 
                    :show-label="true"
                    label-name="email"
                    :value="data.email"
                    @input="value => {
                        isFormDirty = true  
                        data.email = value
                    }"
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
                    @input="value => {
                        isFormDirty = true  
                        data.bvn = value
                    }"
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
                    :value="data.dob.length > 0? data.dob: dayjs(data.dob).format('DD/MM/YYYY')"
                    @input="value => {
                        isFormDirty = true  
                        data.dob = value
                    }"
                    @valid="value => validateFormInput(value, 'dob')"
                />
              </div>       
            </div>

            <div class="flex sm:w-96 w-full justify-between items-center">
                <span class=" border-b border-almost-dark w-2/5"></span>
                <span class="text-sm text-input-placeholder w-1/5 text-center">optional</span>
                <span class=" border-b border-almost-dark  w-2/5"></span>
            </div>

            <div class="sm:w-96 w-full">
              <GeneralPasswordInput
                    name="old_password" 
                    place-holder="Old password" 
                    :show-label="true"
                    :optional="true"
                    label-name="old password"
                    @input="value => {
                        data.old_password = value
                        isFormDirty = true  
                    }"
                    @valid="value => {}"
              />
            </div>

            <div class="sm:w-96 w-full">
              <GeneralPasswordInput
                    name="password" 
                    place-holder="New Password" 
                    :show-label="true"
                    :optional="true"
                    label-name="New password"
                    @input="value => {
                        data.password = value
                        isFormDirty = true  
                    }"
                    @valid="value => {}"
              />
            </div>
            <div class="sm:w-96 w-full mt-2">
                  <GeneralButton 
                      :name="formSubmitting?'Saving...':isFormDirty? 'Save': 'Saved'" 
                      @clicked="updateUserProfile(data)"
                      :disabled="validFormFields.length !== formFields || formSubmitting || !(validFormFields.length === formFields && isFormDirty)"
                  />
            </div>

        </div>
    </div>
</template>
<script setup lang="ts">
    import { ref, onBeforeMount } from 'vue'
    import dayjs from 'dayjs'

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


   const formFields = ref(6) //since the password fields are optional and two fields aren't used on the form
   const validFormFields = ref<string[]>([])
   const formSubmitting = ref(false)
   const isFormDirty = ref(false)

   onBeforeMount(() => {
        const user: any = useCookie('user')
        const jwtToken = useCookie('jwtToken')

        if(!jwtToken.value || !user.value){
            navigateTo('/auth/login')
        }

       data.value =  user.value
       data.value.old_password = ''
       data.value.password = ''
   })

   const verifyPhone = () => {
    const user: any = useCookie('user')

    if(user.value){
        const phone: any = useCookie('phone')
        phone.value = JSON.stringify(user.value.phone)

        const email: any = useCookie('email')
        email.value = JSON.stringify(user.value.email)
        navigateTo('/auth/otp')
    }   
   }

   const validateFormInput = (valid: boolean, formInput: string) => {
      if(valid){
            if(!validFormFields.value.includes(formInput)){
                validFormFields.value.push(formInput)
            }    
              
        }else{
            validFormFields.value = validFormFields.value.filter(validFormField => validFormField !== formInput)
      }
   }

    const updateUserProfile = async (data: any) => {
        formSubmitting.value = true
        const userProfileStore = userStore()
        let payload: any = {
            id: data.id,
            first_name: data.first_name,
            last_name: data.last_name,
            phone: data.phone,
            email: data.email,
            bvn: data.bvn,
            dob: data.dob,
            email_verified: data.email_verified,
            phone_verified: data.phone_verified
        }

        if(data.old_password.length > 6 && data.password.length > 6){
            payload.old_password = data.old_password
            payload.password = data.password
        }

        try {
            const updatedProfileResponse = await userProfileStore.updateUserProfile(payload)
            if (updatedProfileResponse.status === 'success' && updatedProfileResponse.data) {
                // Store updated user in cookie
                const authUser = useCookie('user')  
                authUser.value = JSON.stringify(updatedProfileResponse.data)

                formSubmitting.value = false
                isFormDirty.value = false
            }  
        } catch (error) {
            formSubmitting.value = false
            isFormDirty.value = true
        }
   }
</script>