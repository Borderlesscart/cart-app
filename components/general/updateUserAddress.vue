<template>
    <div class="w-10/12 mx-auto pb-6  max-w-6xl">


        <div class="text-base  text-login-offwhite">
            <span>Delivery Address</span>
        </div>

        <div class="flex flex-col items-center mt-4">
    
            <div class="sm:w-96 w-full flex justify-between">
              
              <div class="w-5/12">
                  <GeneralTextInput 
                    type="text"
                    name="country" 
                    place-holder="Nigeria" 

                    :show-label="true"
                    label-name="Country"
                    :value="data.country"
                    @input="value => {
                        data.country = value
                        isFormDirty = true  
                    }"
                    @valid="value => validateFormInput(value, 'country')"
                  />
              </div>

              <div class="w-5/12">
                <GeneralTextInput 
                    type="text"
                    name="state" 
                    place-holder="State" 
                    :show-label="true"
                    label-name="State"
                    :value="data.state"
                    @input="value => {
                        data.state = value
                        isFormDirty = true  
                    }"
                    @valid="value => validateFormInput(value, 'state')"
                  />
              </div>       
            </div>

            <div class="sm:w-96 w-full ">
                  <GeneralTextInput 
                    type="text"
                    name="address" 
                    place-holder="12 Isaac Johns close, Ikeja GRA, Lagos" 
                    :show-label="true"
                    label-name="address"
                    :value="data.address"
                    @input="value => {
                        data.address = value
                        isFormDirty = true  
                    }"
                    @valid="value => validateFormInput(value, 'address')"
                  />             
            </div>

            <div class="sm:w-96 w-full flex justify-between">
              
              <div class="w-5/12">
                  <GeneralTextInput 
                    type="text"
                    name="city" 
                    place-holder="Lagos City" 
                    :show-label="true"
                    label-name="City"
                    :value="data.bvn"
                    @input="value => {
                        isFormDirty = true  
                        data.city = value
                    }"
                    @valid="value => validateFormInput(value, 'city')"
                  />
              </div>

              <div class="w-5/12">
                <GeneralTextInput 
                    type="text"
                    name="zip" 
                    place-holder="10110001" 
                    :show-label="true"
                    label-name="Zip"
                    :value="data.dob"
                    @input="value => {
                        isFormDirty = true  
                        data.Zip = value
                    }"
                    @valid="value => validateFormInput(value, 'zip')"
                  />
              </div>       
            </div>
<!-- || !(validFormFields.length === formFields && isFormDirty) -->
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
    import { ref, onMounted, onBeforeMount } from 'vue'

    const data = ref<any>({
      country: '',
      state: '',
      address: '',
      city: '',
      zip: '',
      address_type: '',
   })


   const formFields = ref(5) 
   const validFormFields = ref<string[]>([])
   const formSubmitting = ref(false)
   const isFormDirty = ref(false)

   onBeforeMount(() => {
        const user: any = useCookie('user')
        const jwtToken = useCookie('jwtToken')

        if(!jwtToken.value || !user.value){
            navigateTo('/auth/login')
        }

        var userAddress: any 

        userAddress = user.value?.addresses?.find((address: any) => address.type === 'shipping')

        if(userAddress){
            console.log(userAddress)
        }


   })

   const getUserDeliveryAddress = async () => {

   }

   const verifyPhone = () => {
    const user: any = useCookie('user')
    if(user.value){
        const phone: any = useCookie('phone')
        phone.value = JSON.stringify(user.value.phone)
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
      console.log(validFormFields.value.length, formFields.value)
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