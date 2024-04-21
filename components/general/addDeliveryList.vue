<template>
    <div>
      <div class="sm:text-base text-sm">
            <span>Select country you shipped from</span>
        </div>
        
        <div class="">
            <GeneralDeliveryList
              @update-list-item="updatedDeliveryList => updateDeliveryList(updatedDeliveryList)"
              @update-screen-shot-list="updateduploadList => updateScreenShotList(updateduploadList)"
              @validate-form-input="(valid, formInput) => validateFormInput(valid, formInput)"
              :delivery-list-items-prop="deliveryListItems"
              :delivery-upload-items-prop="deliveryUploadItems"
              :valid-list="deliveryUploadItems.length+deliveryList.length === validFormFields.length"
              page="addDelivery"
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
      name: '',
      id: null,
      file: null
    }])
    const validFormFields = ref<string[]>([])
    const deliveryUploadItems = ref<Array<any>>([{}])
    const deliveryList = ref<Array<any>>([{
      name: ''
    }])

    watch(deliveryListItems, async (newDeliveryListItems, oldDeliveryListItems) => {  
      deliveryList.value = newDeliveryListItems?.filter(listItem => listItem.name.length > 0 )
    })

    

    const updateScreenShotList = (updatedList: any) => {
      deliveryUploadItems.value = updatedList
    }

    const updateDeliveryList = (updatedList: any) => {
      deliveryListItems.value = updatedList
      /**
       * if image upload, upload directly, else
       */
    }


    const validateFormInput = (valid: boolean, formInput: string) => {
            if(valid){
                if(!validFormFields.value.includes(formInput)){
                    validFormFields.value.push(formInput)
                }   
                
                // if done writing list item, store to DB. If done uploading image. store
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
      
      // var deliveryId
      // if(userProfileStore.deliveryItems.length > 0){
      //   deliveryId = userProfileStore.deliveryOptions
      // }

      const uploadFiles = deliveryUploadItems.value

      if(uploadFiles){
          const uploadData: any = {
            file: uploadFiles[0],
            origin_country: selectedCountryAddress.value.code.toUpperCase(),
            destination_country: 'ng'
          }

          // if(deliveryId){
          //   uploadData.delivery_id = deliveryId
          // }

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