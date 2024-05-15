<template>
    <div class="w-10/12 mx-auto pb-6  max-w-6xl">


        <div class="text-base  text-login-offwhite">
            <span>Delivery Address</span>
        </div>

        <div class="text-xs flex flex-col grow-1 text-login-offwhite mt-2">
        <div class="flex ">
          <span class="" >
              This is where we ship your items to.
          </span>
        </div>
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
                    :value="data.city"
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
                    :value="data.zip"
                    @input="value => {
                        isFormDirty = true  
                        data.zip = value
                    }"
                    @valid="value => validateFormInput(value, 'zip')"
                  />
              </div>       
            </div>
            <div class="sm:w-96 w-full mt-2">
                  <GeneralButton 
                      :name="formSubmitting?'Saving...':isFormDirty? 'Save': 'Saved'" 
                      @clicked="updateUserAddress(data)"
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
      address_type: 'shipping',
      user_id: null
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

        userAddress = user.value?.addresses?.find((address: any) => address.address_type === 'shipping')

        if(userAddress){
            data.value = userAddress
        }
   })

   const validateFormInput = (valid: boolean, formInput: string) => {
      if(valid){
            if(!validFormFields.value.includes(formInput)){
                validFormFields.value.push(formInput)
            }    
              
        }else{
            validFormFields.value = validFormFields.value.filter(validFormField => validFormField !== formInput)
      }
   }

   const updateUserAddress = async (data: any) => {
    formSubmitting.value = true
    const userProfileStore = userStore()

    try {
        const updatedUserAddressResponse = await userProfileStore.updateUserAddress(data)
        if (updatedUserAddressResponse.status === 'success' && updatedUserAddressResponse.data) {
            // Store updated user in cookie
            const oldUser: any = useCookie('user')  
            const newUserAddress = [updatedUserAddressResponse.data]
            oldUser.value.addresses = newUserAddress

            formSubmitting.value = false
            isFormDirty.value = false
        }  
    } catch (error) {
        formSubmitting.value = false
        isFormDirty.value = true
    }

    
   }
</script>