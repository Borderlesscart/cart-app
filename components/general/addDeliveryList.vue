<template>
    <div>
        <div class="sm:text-base text-sm">
            <span>Add delivery items</span>
        </div>
        <div class="text-xs flex flex-col grow-1 text-login-offwhite mb-4">
            <div class="flex mt-2">
            <span class="" >
                List or upload screenshot of your order 
            </span>
            </div>
        </div>
        <div class="max-h-44 overflow-y-scroll scrollbar">
            <GeneralDeliveryList
              @update-list-item="updatedDeliveryList => updateDeliveryList(updatedDeliveryList)"
              @update-screen-shot-list="updateduploadList => updateScreenShotList(updateduploadList)"
              @validate-form-input="(valid, formInput) => validateFormInput(valid, formInput)"
              :delivery-list-items-prop="deliveryListItems"
              :delivery-upload-items-prop="deliveryUploadItems"
            />
        </div>
        <div class="sm:text-base text-sm">
            <span>Select country you shipped from</span>
        </div>
        <div class="mt-4 flex flex-wrap grow">
            <GeneralCountries 
            @clicked="(country: Country) => updateCountryAddress(country)"
            />
        </div>

        <div class="text-login-offwhite w-10/12 mt-6">
          <div class="">
            <button v-if="!loading" class="text-primary" @click="saveDeliveryItems()">
                 {{ !loading && !itemSaved ? 'Save items': 'Saved' }} 
            </button>
            <button v-else="loading" class="text-primary">
                  Saving...
            </button>
          </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { ref, onMounted, onBeforeMount } from 'vue'
    import { useCookie } from 'nuxt/app';
    import type { Country } from '~/types'

    const selectedCountryAddress = ref<any>(null)
   
    const loading = ref<boolean>(false)
    const itemSaved = ref<boolean>(false)
    const user = ref({})
    const deliveryListItems = ref<Array<any>>()
    const validFormFields = ref<string[]>([])
    const deliveryUploadItems = ref<Array<any>>()


    const updateCountryAddress = (selectedCountry: Country) => {
      selectedCountryAddress.value = selectedCountry
    }

    const updateScreenShotList = (updatedList: any) => {
      console.log(updatedList)
      deliveryUploadItems.value = updatedList
    }

    const updateDeliveryList = (updatedList: any) => {
      console.log('delivertList',updatedList)
      deliveryListItems.value = updatedList
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

    const saveDeliveryItems = async () => {
      const notification = useNotificationStore()
      const userCookie: any|undefined = useCookie('user')
      const totalDeliveryItems = deliveryListItems.value?.length
      const totalUploadedItems = deliveryUploadItems.value?.length
      if(totalDeliveryItems !== validFormFields.value.length){
        notification.updateError('item(s) name or screenshot required')
        return
      }

      if(!selectedCountryAddress.value){
        notification.updateError("Select warehouse's country")
        return
      }

      if(!user.value){
        navigateTo('/auth/login')
      }

      loading.value = true
      
      const data = {
        customer_id: userCookie?.value?.id,
        origin_country: selectedCountryAddress.value.code.toUpperCase(),
        destination_country: 'NG',
        data: deliveryListItems.value
      }

      console.log(deliveryUploadItems.value)
      const userProfileStore = userStore()
      // const storeBulkItems = await userProfileStore.storeBulkDeliveryItem(data)
      loading.value = false
      itemSaved.value = true
    }
</script>