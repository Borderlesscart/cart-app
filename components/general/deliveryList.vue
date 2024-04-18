<template>
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
      <div v-for="(deliveryItem, key) in deliveryListItems" class="w-full lg:w-8/12 flex ">
            <div class="sm:w-8/12 w-6/12">
              <GeneralSmallTextInput
              name="shipped item"
              place-holder="list shipped item"
              label-name="shipped item"
              :optional="true"
              :auto-focus="key === 0?true:false"
              :intial-value="deliveryItem.name"
              @input="value => deliveryItem.name = value"
              @valid="value => validateFormInput(value, 'name_'+key)"
              />
            </div>   
            <div class="sm:w-4/12 w-6/12 flex justify-between">
              <div class="w-4/12 flex items-baseline cursor-pointer mr-4 filepond--label-action">
                <span class="mt-1 mr-auto mb-auto ml-4 text-xs relative top-1 right-1">or</span>
                    <FileUpload 
                    :name="'image-item-'+key"
                    @upload="onTemplatedUpload($event)" 
                    :multiple="false" 
                    accept="image/*" 
                    :maxFileSize="1000000" 
                    @select="file => onSelectedFiles(file, 'name_'+key)"
                    @remove="clearSelectedFile('name_'+key)"
                    :pt="fileUploadStyle"
                    @before-upload="data => beforeUpload(data)"
                    >
                    <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
                      <div class="" v-if="files.length === 0" @click="chooseCallback()">
                        <img src="/img/upload.svg" class="w-8 mx-auto">
                        <span class="text-login-offwhite text-xs">upload</span>
                      </div>
                      <span v-else></span>
                    </template>
                    <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
                      <div v-if="files.length > 0">
                        <div v-for="(file, index) of files" :key="file.name + file.type + file.size" >
                           <div class="p-0 flex flex-col items-center">
                            <img role="presentation" :alt="file.name" :src="file.objectURL" class="w-8 h-8 mx-auto rounded-lg" />
                            <button class="text-login-offwhite text-xs" @click="removeFileCallback()">remove</button>
                           </div>
                        </div>
                      </div>
                    </template>
                    <template #empty>

                    </template>  
                    </FileUpload>
              </div>

              <div v-if="key+1 === deliveryListItems.length" class="w-4/12 flex items-baseline cursor-pointer" @click="addListItem()">
                <img src="/img/add.svg" class="w-8 mx-auto">
              </div>
              
              <div v-if="key > 0" class="w-3/12  h-max" @click="deleteListItem(key)">
                <img src="/img/trash.svg" class="w-8 relative trash">
              </div>
            </div>
      </div>
    </div>  
</template>
<script lang="ts" setup>
import { onMounted, ref, toRefs, onBeforeMount, watch } from 'vue';
import FileUpload from 'primevue/fileupload'
import 'primevue/resources/themes/mdc-dark-deeppurple/theme.css'

import type { Country } from '~/types'

const selectedCountryAddress = ref<any>(null)

const props = defineProps({
    deliveryListItemsProp: {
        type: Array,
        default: [{
          name: ''
        }]
    },
    deliveryUploadItemsProp: {
      type: Array,
      default: [{}]
    },
    validList: {
      type: Boolean,
      default: false
    }
})

const { deliveryListItemsProp, deliveryUploadItemsProp, validList } = toRefs(props)

const emits = defineEmits(['updateListItem', 'updateScreenShotList', 'validateFormInput'])
const deliveryListItems = ref<Array<any>>(deliveryListItemsProp.value)
const deliveryUploadItems = ref<Array<any>>(deliveryUploadItemsProp.value)

const fileUploadStyle = ref({
      root: 'bg-dark',
      buttonbar: 'bg-dark p-0',
      content: 'bg-dark p-0',
      badge: 'hidden',
      fileName: 'hidden',
      fileSize: 'hidden',
      file: 'p-0'
})

const validFormFields = ref<string[]>([])

const uploadListItem = ref<any[]>([])

const isListFormValid = ref<boolean>(false)

const userProfileStore = userStore()

const deliveryId = ref<any>(null)

const updateCountryAddress = (selectedCountry: Country) => {
  selectedCountryAddress.value = selectedCountry
}

const clearSelectedFile = (formInput: string) => {
      const key = parseInt(formInput.split('_')[1])
      if(isValidFormInput(formInput)){
        emits('validateFormInput', false, formInput)
        sanitizeList(key)
        validateFormInput(false, formInput)
      }
      const uploadListKey = key - 1
      uploadListItem.value = uploadListItem.value.filter((uploadItem: any, index: number) => index !== uploadListKey)
      emits('updateScreenShotList', uploadListItem.value)
}

const beforeUpload = (data: any) => {
     
}

const addListItem = async () => {
  if(isListFormValid.value){
    // store last item 
    const oldDeliveryListItems = deliveryListItems.value
    const latestDeliveryItem = oldDeliveryListItems[oldDeliveryListItems.length - 1]

    if(latestDeliveryItem.id === null){
      // Upload to DB
      if(latestDeliveryItem.file){
        // upload image and name if available
        const formData = new FormData()
        formData.append('file', latestDeliveryItem.file)
        formData.append('origin_country', selectedCountryAddress.value.code.toUpperCase())
        formData.append('destination_country', 'NG')
        if(deliveryId.value){
          formData.append('delivery_id', deliveryId.value)
        }
        
        if(latestDeliveryItem.name !== ''){
          formData.append('name', latestDeliveryItem.name)
        }

        const userProfileStore = userStore()

        await userProfileStore.uploadDeliveryItems(formData)
      }else{
        // upload name
      }
    }
    emits('updateListItem', deliveryListItems.value)
    deliveryListItems.value.push({name: '', id: null, file: null})
    isListFormValid.value = validFormFields.value.length === deliveryListItems.value.length
  } 
}

const deleteListItem = (key: any) => {
      deliveryListItems.value = deliveryListItems.value.filter((item: any, index) => index !== key)
      emits('updateListItem', deliveryListItems.value)
}

const sanitizeList = (key: number) => {
      const list = deliveryListItems.value
      if(list.length > 1){
        deliveryListItems.value = list.filter((item, index) => key !== index)
      }
}

const validateFormInput = (valid: boolean, formInput: string) => {
  emits('validateFormInput', valid, formInput)
 const currentValidFormFields = validFormFields.value
  if(valid){
    if(!currentValidFormFields.includes(formInput)){
      currentValidFormFields.push(formInput)
      validFormFields.value = currentValidFormFields
    }        
  }else{
        validFormFields.value = validFormFields.value.filter(validFormField => validFormField !== formInput)
  }

  isListFormValid.value = validFormFields.value.length === deliveryListItems.value.length
}

const onTemplatedUpload = (value: any) => {

}

const onSelectedFiles = (data: any, formInput: string) => {
      if(!isValidFormInput(formInput)){
        emits('validateFormInput', true, formInput)
        validateFormInput(true, formInput)
      }

      const file = data.files[0]
      console.log(file)

      const key = parseInt(formInput.split('_')[1])

      // const uploadList = uploadListItem.value
      // if(!uploadList.find((value, index) => index === key)){
      //   uploadListItem.value.push(file)
      // }
      // deliveryUploadItems.value = uploadListItem.value
      const currentDeliveryListItems = deliveryListItems.value
      const listItem: any = currentDeliveryListItems[key] 
      listItem.file = file
      currentDeliveryListItems[key] = listItem
      deliveryListItems.value = currentDeliveryListItems

      emits('updateScreenShotList', uploadListItem.value)
 }

 const isValidFormInput = (formInput: string) => {
      if(validFormFields.value.includes(formInput)){
        return true
      }
      return false
  }
</script>