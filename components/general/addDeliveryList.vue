<template>
    <div>
      <div class="sm:text-base text-sm">
            <span>Select country you shipped from</span>
        </div>
        
        <div class="">
            <GeneralDeliveryList
              @update-screen-shot-list="updateduploadList => updateScreenShotList(updateduploadList)"
              @validate-form-input="(valid, formInput) => validateFormInput(valid, formInput)"
              :delivery-list-items-prop="deliveryListItems"
              :delivery-upload-items-prop="deliveryUploadItems"
              :valid-list="deliveryUploadItems.length+deliveryList.length === validFormFields.length"
              page="addDelivery"
            />
        </div>
         
    </div>
</template>
<script setup lang="ts">
    import { ref, onMounted, onBeforeMount, watch } from 'vue'
    import { useCookie } from 'nuxt/app';

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


    const validateFormInput = (valid: boolean, formInput: string) => {
            if(valid){
                if(!validFormFields.value.includes(formInput)){
                    validFormFields.value.push(formInput)
                }     
            }else{
                validFormFields.value = validFormFields.value.filter(validFormField => validFormField !== formInput)
            }
    }

    const init = () => {
      deliveryList.value = deliveryListItems.value?.filter(listItem => {
        return listItem.name.length > 0
      })
    }

    init()
</script>