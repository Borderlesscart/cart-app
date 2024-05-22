<template>
    <div class="mt-4 flex flex-wrap grow mb-6">
        <GeneralCountries 
          @clicked="(country: Country) => updateCountryAddress(country)"
          :disabled="deliveryOptions.id !== null"
          :select-country-code="deliveryOptions.origin_country"
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
              :place-holder="deliveryItem.image_list_link ? '': 'e.g Nike shoes'"
              label-name="shipped item"
              :optional="true"
              :auto-focus="key === 0?true:false"
              :intial-value="deliveryItem.name"
              @input="(value) => {
                deliveryItem.name = value
                if(deliveryItem.id){
                  isDirtyForm = true
                  loading = true
                  updateDeliveryItemName(deliveryItem, key)
                }
              }"
              @valid="value => validateFormInput(value, 'name_'+key)"
              />
            </div>   
            <div class="sm:w-4/12 w-6/12 flex justify-between">
              <div class="w-4/12 flex items-baseline cursor-pointer mr-4 filepond--label-action">
                <span class="mt-1 mr-auto mb-auto ml-4 text-xs relative top-1 right-1">or</span>
                    <FileUpload
                    v-if="deliveryItem?.image_list_link === null" 
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
                        <img :src="uploadImg" class="w-8 mx-auto">
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
                    <div
                    v-else
                    class="w-4/12 flex items-baseline cursor-pointer mr-4 filepond--label-action"
                    >
                      <div>
                        <!-- <div class="w-8 h-8 mx-auto"> -->
                          <div class="">
                            <Image 
                            :src="config.public.baseUrl+'public/img/'+deliveryItem.image_list_link"
                            preview
                            :pt="imagePreviewStyle"
                            />
                            <button 
                              class="text-login-offwhite text-xs"
                              @click="removeDeliveryItemImage(deliveryItem, key)"
                            >
                            remove
                            </button>
                          </div>
                          
                      </div>
                    </div>
              </div>
<!-- If item is last item, add delete button. On delete, if no more item in deliveryList, add dummy item -->
              <div v-if="key+1 === deliveryListItems.length && (deliveryItem.image_list_link || deliveryItem.name)" class="w-3/12  h-max" @click="deleteListItem(key)">
                <img :src="trashImg" class="w-8 relative trash">
              </div>

              <div v-if="key+1 === deliveryListItems.length && loading" class="w-4/12 flex items-baseline cursor-pointer" @click="addListItem()">
                <img :src="addDisabledImg" class="w-8 mx-auto">
              </div>

              <div v-if="key+1 === deliveryListItems.length && !loading" class="w-4/12 flex items-baseline cursor-pointer" @click="addListItem()">
                <img :src="addImg" class="w-8 mx-auto">
              </div>
              <!-- if last item and saved -->
              <div v-if="key > 0 && key+1 < deliveryListItems.length" class="w-3/12  h-max" @click="deleteListItem(key)">
                <img :src="trashImg" class="w-8 relative trash">
              </div>
            </div>
      </div>
    </div>  
    <div class="text-login-offwhite w-10/12">
          <div v-if="isDirtyForm">
            <button class="text-primary">
                 {{ loading ? 'Saving...': 'Saved' }} 
            </button>
          </div>
        </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, toRefs, onBeforeMount, watch } from 'vue';
import FileUpload from 'primevue/fileupload'
import 'primevue/resources/themes/mdc-dark-deeppurple/theme.css'
import Image from 'primevue/image';
import uploadImg from '~/assets/img/upload.svg'
import trashImg from '~/assets/img/trash.svg'
import addDisabledImg from '~/assets/img/add-disabled.svg'
import addImg from '~/assets/img/add.svg'


import type { Country } from '~/types'
import { userStore } from '#imports';
import { CountryAddresses } from '~/consts';
import Tree from 'primevue/tree';

const props = defineProps({
    deliveryListItemsProp: {
        type: Array,
        default: [{
          name: '',
          id: null,
          image_list_link: null
        }]
    },
    deliveryUploadItemsProp: {
      type: Array,
      default: [{}]
    },
    validList: {
      type: Boolean,
      default: false
    },
    selectedCountryAddressProp: {
      type: Object,
      default: null
    },
    page: {
      type: String,
      default: 'addDelivery'
    }
})

const { deliveryListItemsProp, deliveryUploadItemsProp, validList, selectedCountryAddressProp, page } = toRefs(props)

const emits = defineEmits(['updateListItem', 'updateScreenShotList', 'validateFormInput'])

const config = useRuntimeConfig()

const deliveryListItems = ref<Array<any>>([{
  name: '',
  id: null,
  image_list_link: null,
  file: null
}])

const deliveryOptions = ref<any>({id: null})

const selectedCountryAddress = ref<any>(selectedCountryAddressProp.value)

const fileUploadStyle = ref({
      root: 'bg-dark',
      buttonbar: 'bg-dark p-0',
      content: 'bg-dark p-0',
      badge: 'hidden',
      fileName: 'hidden',
      fileSize: 'hidden',
      file: 'p-0'
})

const imagePreviewStyle = ref({
  root: 'block',
  image: 'w-8 h-8 mx-auto'
})

const validFormFields = ref<string[]>([])

const uploadListItem = ref<any[]>([])

// Responsible for adding new form to list
const isListFormValid = ref<boolean>(false)

const userProfileStore = userStore()

const loading = ref<boolean>(false)

const notification = useNotificationStore()

const isDirtyForm = ref<boolean>(false)


const updateCountryAddress = (selectedCountry: Country) => {
  selectedCountryAddress.value = selectedCountry
}

onBeforeMount(() => {
  const userProfileStore: any = userStore()
  // populate delivery fields from store based on page selected
  if(page.value == "viewDelivery"){
    deliveryListItems.value = userProfileStore.viewDeliveryItems.data
    deliveryOptions.value = userProfileStore.viewDeliveryItems.delivery
  }else{
    deliveryListItems.value = userProfileStore.newDeliveryItems.data
    deliveryOptions.value = userProfileStore.newDeliveryItems.delivery
  }

  if(deliveryOptions.value.id){
    selectedCountryAddress.value = CountryAddresses.find(country => country.code === deliveryOptions.value.origin_country)
  }

  // automatically validate form input
  for(let i = 0; i < deliveryListItems.value.length; i++){
      const deliveryItem = deliveryListItems.value[0]
      if(deliveryItem.name || deliveryItem.image_list_link){
        validateFormInput(true, 'name_'+i)
      }
  }

  if (deliveryListItems.value.length === 0) {
    updateLocalAndGlobalList([{
          name: '',
          file: null,
          id: null,
          image_list_link: null
    }])
  }
})

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

const removeDeliveryItemImage = async (deliveryItem: any, key: any = null) => {
  isDirtyForm.value = true
  loading.value = true
  const newDeliveryItem = {
    ...deliveryItem,
    image_list_link: null
  }

  if(!newDeliveryItem.name || length <= 0 && newDeliveryItem.image_list_link == null || newDeliveryItem.image_list_link == ''){
    await deleteListItem(key)
    loading.value = false
    return
  }

  const response = await userProfileStore.updateDeliveryItem(newDeliveryItem)
  const updatedDeliveryItem = response.data

  deliveryListItems.value = deliveryListItems.value.map((listItem: any) => {
    if(listItem.id === updatedDeliveryItem.id){
      return updatedDeliveryItem
    }
    return listItem
  })
  loading.value = false
}

const storeLastItem = async (): Promise<boolean> => {
    var stored = false
    loading.value = true

    const oldDeliveryListItems = deliveryListItems.value
    const latestDeliveryItem = oldDeliveryListItems[oldDeliveryListItems.length - 1]

    if(latestDeliveryItem.id === null){
      // Upload to DB
      var latestItem
      var delivery
      if(latestDeliveryItem.file){
        // upload image and name if available
        const formData = new FormData()
        formData.append('file', latestDeliveryItem.file)
        formData.append('origin_country', selectedCountryAddress.value.code.toUpperCase())
        formData.append('destination_country', 'NG')
        if(deliveryOptions.value.id){
          formData.append('delivery_id', deliveryOptions.value.id)
        }

        if(latestDeliveryItem.name !== ''){
          formData.append('name', latestDeliveryItem.name)
        }

        const userProfileStore = userStore()
        const itemResponse = await userProfileStore.uploadDeliveryItems(formData)
        latestItem = itemResponse.data
        delivery = itemResponse.delivery
      }else if(latestDeliveryItem.name.length > 0){
        // upload name
        const userCookie: any|undefined = useCookie('user')
        const deliveryListData: any = {
          customer_id: userCookie?.value?.id,
          origin_country: selectedCountryAddress.value.code.toUpperCase(),
          destination_country: 'NG',
          data: [{name: latestDeliveryItem.name}]
        }
        if (deliveryOptions.value.id) {
          deliveryListData.delivery_id = deliveryOptions.value.id
        }
        const itemResponse =  await userProfileStore.storeBulkDeliveryItem(deliveryListData)
        latestItem = itemResponse.data[0]
        delivery = itemResponse.delivery
      }
     
      if(latestItem && delivery){
          oldDeliveryListItems[oldDeliveryListItems.length - 1] = {
          id: latestItem.id,
          name: latestItem.name?latestItem.name:'',
          image_list_link: latestItem.image_list_link
        }

        deliveryListItems.value = oldDeliveryListItems  
        deliveryOptions.value = delivery

        updateLocalAndGlobalList(deliveryListItems.value, deliveryOptions.value)
        stored = true
      }
     
    }

    loading.value = false
    if (stored) {
      isDirtyForm.value = true
    }
    return stored
}

const addListItem = async () => {

  if(isListFormValid.value){

    if(!selectedCountryAddress.value){
        notification.updateError("Select country")
        return
    }
    // store last item 
    const stored: boolean = await storeLastItem()

    emits('updateListItem', deliveryListItems.value)
    deliveryListItems.value.push({name: '', id: null, image_list_link: null})
    isListFormValid.value = validFormFields.value.length === deliveryListItems.value.length
  } 
}

const deleteListItem = async (key: any) => {
  const userProfileStore: any = userStore()
  var deletedListItem: any
  // Update deliveryList
      deliveryListItems.value =  deliveryListItems.value.filter( (item: any, index) =>
      {
        if(index !== key){
          validateFormInput(true, 'name_'+key)
          return true
        }else{
           // validateFormInout here
          validateFormInput(false, 'name_'+key)
          deletedListItem = item
          isDirtyForm.value = false
          return false
        }
      })

      if(deletedListItem){
        // make API call to delete list item
        await userProfileStore.deleteListItem(deletedListItem.id)
      }
      
      if(deliveryListItems.value.length > 0){
        updateLocalAndGlobalList(deliveryListItems.value)
      }else{
        updateLocalAndGlobalList([{
          name: '',
          file: null,
          id: null,
          image_list_link: null
        }])
      } 
}

const updateLocalAndGlobalList = (deliveryList: any, deliveryOptions: any = null) => {
  const userProfileStore: any = userStore()
  deliveryListItems.value = deliveryList
  if(page.value === 'addDelivery'){
    userProfileStore.newDeliveryItems.data = deliveryListItems.value
    if(deliveryOptions){
      userProfileStore.newDeliveryItems.delivery = deliveryOptions
    }
  }else{
    userProfileStore.viewDeliveryItems.data = deliveryListItems.value
    if(deliveryOptions){
      userProfileStore.viewDeliveryItems.delivery = deliveryOptions
    }
  }

  isListFormValid.value = validFormFields.value.length === deliveryListItems.value.length
}

const sanitizeList = (key: number) => {
      const list = deliveryListItems.value
      if(list.length > 1){
        deliveryListItems.value = list.filter((item, index) => key !== index)
      }
}

const updateDeliveryItemName =  useDebounce(async (deliveryItem: any, key: any = null) => {
  if (deliveryItem.name.length >= 3) {
    await userProfileStore.updateDeliveryItem(deliveryItem)
    loading.value = false
  }

  if(deliveryItem.name.length < 3 && deliveryItem.image_list_link){
    await userProfileStore.updateDeliveryItem(deliveryItem)
    loading.value = false
  }

  if (deliveryItem.name.length <= 0 && deliveryItem.image_list_link == null || deliveryItem.image_list_link == '') {
    await deleteListItem(key)
    loading.value = false
  }
    
}, 4000)

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

const onSelectedFiles = async (data: any, formInput: string) => {
      if(!isValidFormInput(formInput)){
        emits('validateFormInput', true, formInput)
        validateFormInput(true, formInput)
      }

      const file = data.files[0]
      const key = parseInt(formInput.split('_')[1])
 
      const currentDeliveryListItems = deliveryListItems.value
      const listItem: any = currentDeliveryListItems[key] 
      listItem.file = file


      if(listItem.id){
        // upload to server
        loading.value = true
        const oldDeliveryListItems = deliveryListItems.value

        const formData = new FormData()
        formData.append('file', listItem.file)
        formData.append('origin_country', selectedCountryAddress.value.code.toUpperCase())
        formData.append('destination_country', 'NG')
        formData.append('list_id', listItem.id)
        if(deliveryOptions.value.id){
          formData.append('delivery_id', deliveryOptions.value.id)
        }

        const userProfileStore = userStore()
        const itemResponse = await userProfileStore.uploadDeliveryItems(formData)
        const latestItem = itemResponse.data
        const delivery = itemResponse.delivery

        if(latestItem && delivery){
          oldDeliveryListItems[key] = {
          id: latestItem.id,
          name: latestItem.name?latestItem.name:'',
          image_list_link: latestItem.image_list_link
        }

        deliveryListItems.value = oldDeliveryListItems  
        deliveryOptions.value = delivery

        updateLocalAndGlobalList(deliveryListItems.value, deliveryOptions.value)
      }
        
        loading.value = false
      }

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