<template>
    <div>
      <div class="sm:text-base text-sm">
            <span>Select country you shipped from</span>
        </div>
        <div class="mt-4 flex flex-wrap grow mb-6">
            <GeneralCountries 
            @clicked="(country: Country) => updateCountryAddress(country)"
            />
        </div>

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
              :valid-list="deliveryUploadItems.length+deliveryList.length === validFormFields.length"
            />
        </div>
        

        <div class="text-login-offwhite w-10/12">
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
    import { ref, onMounted, onBeforeMount, watch } from 'vue'
    import { useCookie } from 'nuxt/app';
    import type { Country } from '~/types'

    const selectedCountryAddress = ref<any>(null)
   
    const loading = ref<boolean>(false)
    const itemSaved = ref<boolean>(false)
    const user = ref({})
    const deliveryListItems = ref<Array<any>>([{
      name: ''
    }])
    const validFormFields = ref<string[]>([])
    const deliveryUploadItems = ref<Array<any>>([{}])
    const deliveryList = ref<Array<any>>([{
      name: ''
    }])



    watch(deliveryListItems, async (newDeliveryListItems, oldDeliveryListItems) => {  
      deliveryList.value = newDeliveryListItems?.filter(listItem => listItem.name.length > 0 )
    })

    const updateCountryAddress = (selectedCountry: Country) => {
      selectedCountryAddress.value = selectedCountry
    }

    const updateScreenShotList = (updatedList: any) => {
      deliveryUploadItems.value = updatedList
    }

    const updateDeliveryList = (updatedList: any) => {
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
      const totalDeliveryItems: any = deliveryList.value?.length
      const totalUploadedItems = deliveryUploadItems.value?.length
      const totalFormItems = totalDeliveryItems+totalUploadedItems
      console.log(totalDeliveryItems, totalUploadedItems, validFormFields.value.length)
      if(totalFormItems !== validFormFields.value.length){
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
  
      const deliveryListData = {
        customer_id: userCookie?.value?.id,
        origin_country: selectedCountryAddress.value.code.toUpperCase(),
        destination_country: 'NG',
        data: deliveryList.value
      }

      const userProfileStore = userStore()

      if(deliveryListItems.value && deliveryListItems.value?.length  > 0){
          await userProfileStore.storeBulkDeliveryItem(deliveryListData)
      }
      
      var deliveryId
      if(userProfileStore.deliveryItems.length > 0){
        deliveryId = userProfileStore.deliveryOptions
      }

      const uploadFiles = deliveryUploadItems.value

      if(uploadFiles){
          const uploadData: any = {
            file: uploadFiles[0],
            origin_country: selectedCountryAddress.value.code.toUpperCase(),
            destination_country: 'ng'
          }

          if(deliveryId){
            uploadData.delivery_id = deliveryId
          }

          await userProfileStore.uploadDeliveryItems(uploadData)
      }
      
      
      
      loading.value = false
      itemSaved.value = true
    }

    const init = () => {
      deliveryList.value = deliveryListItems.value?.filter(listItem => {
        return listItem.name.length > 0
      })
    }

    init()
</script>