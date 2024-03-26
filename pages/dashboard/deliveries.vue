<template>
     <!-- Top header -->
     <NuxtLayout name="dashboard-layout"></NuxtLayout>
     <GeneralNavbar/>

     <div class="mt-10 m-auto text-off-white font-inter w-10/12 pb-14 max-w-6xl">
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
          <!-- <div class="w-full lg:w-8/12 flex mb-2">
            <div 
            class="cursor-pointer px-4 py-2 flex w-10/12 sm:w-8/12 border rounded-lg bg-login-offwhite text-dark justify-between"
            >
              <div class="flex flex-col w-10/12">
                <span class="text-sm pb-1 font-bold font-judson">US to Lagos delivery items</span>
              </div>
              <div class="text-dark-primary text-xs flex m-auto w-2/12">
                <span>View </span>
              </div>
            </div>
            <div class="w-2/12 m-auto">
              <img src="/img/add.svg" class="w-8 m-auto">
            </div>
          </div> -->
          <GeneralDeliveryList
          :delivery-list-items-prop="deliveryListItems"
          />
          <!-- <div v-for="(deliveryItem, key) in deliveryListItems" class="w-full lg:w-8/12 flex ">
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
            
          
          </div> -->
        </div>
       
        <div class="sm:text-base text-sm mt-2">
            <span>Select country's warehouse you shipped to</span>
        </div>
        <div class="text-xs flex flex-col grow-1 text-login-offwhite">
            <div class="flex mt-2">
            <span class="" >
                 The country of the warehouse you shipped to
            </span>
            </div>
        </div>

        <div class="mt-6 flex flex-wrap grow">
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

        <div class="text-xs flex flex-col grow-1 text-login-offwhite absolute bottom-10 w-10/12">
            <div class="flex mt-2 mr">
              <img src="/img/message.svg" class="w-4 mr-2"/>
              <span class="" >
                  We will notify you when we receive your package
              </span>  
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { useCookie } from 'nuxt/app';
    import { ref, onMounted, onBeforeMount } from 'vue'
    import type { Country } from '~/types'
    import FileUpload from 'primevue/fileupload'
    import 'primevue/resources/themes/mdc-dark-deeppurple/theme.css'

    const selectedCountryAddress = ref<any>(null)
    const deliveryListItems = ref([
      {
        name: ''
      }
    ])

    const uploadListItem = ref<any[]>([])
    const deliveryId = ref<number|null>(null)

    const formFields = ref(deliveryListItems.value.length + 1)
    const validFormFields = ref<string[]>([])
    const user = ref({})

    const notification = useNotificationStore()
    const userProfileStore = userStore()
    const loading = ref<boolean>(false)
    const itemSaved = ref<boolean>(false)
    const fileUploadStyle = ref({
      root: 'bg-dark',
      buttonbar: 'bg-dark p-0',
      content: 'bg-dark p-0',
      badge: 'hidden',
      fileName: 'hidden',
      fileSize: 'hidden',
      file: 'p-0'
    })

    const userCookie: any|undefined = useCookie('user')
    const jwtToken: any|undefined = useCookie('jwtToken')

    onBeforeMount(async () => {
       await userProfileStore.getUserDeliveryItems({
        'user_id': userCookie?.value?.id,
        'status': 'pending'
      })
       deliveryListItems.value = userProfileStore.deliveryItems
    })
  
    const onTemplatedUpload = (value: any) => {

    }

    const onSelectedFiles = (data: any, formInput: string) => {
      if(!isValidFormInput(formInput)){
        validateFormInput(true, formInput)
      }

      const file = data.files[0]

      const key = parseInt(formInput.split('_')[1])
      const uploadList = uploadListItem.value
      if(!uploadList.find((value, index) => index === key)){
        uploadListItem.value.push(file)
      }
      
    }

    const beforeUpload = (data: any) => {
     
    }

    const clearSelectedFile = (formInput: string) => {
      const key = parseInt(formInput.split('_')[1])
      if(isValidFormInput(formInput)){
        validateFormInput(false, formInput)
        sanitizeList(key)
      }

    }

    const isValidFormInput = (formInput: string) => {
      if(validFormFields.value.includes(formInput)){
        return true
      }
      return false
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

    const sanitizeList = (key: number) => {
      const list = deliveryListItems.value
      if(list.length > 1){
        deliveryListItems.value = list.filter((item, index) => key !== index)
      }
    }

    const updateCountryAddress = (selectedCountry: Country) => {
      selectedCountryAddress.value = selectedCountry
    }

    const saveDeliveryItems = async () => {
      const totalDeliveryItem = deliveryListItems.value.length
      if(totalDeliveryItem !== validFormFields.value.length){
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

      const storeBulkItems = await userProfileStore.storeBulkDeliveryItem(data)
      loading.value = false
      itemSaved.value = true
    }
    const addListItem = () => {
      const totalDeliveryItem = deliveryListItems.value.length
      if(totalDeliveryItem !== validFormFields.value.length){
        return
      }

      const listItemId = deliveryListItems.value.length + 1
      const item = {
        name: ''
      }

      deliveryListItems.value = [ ...deliveryListItems.value, item]
    }

    const deleteListItem = (key: any) => {
      deliveryListItems.value = deliveryListItems.value.filter((item: any, index) => index !== key)
    }

    const init = () => {
        const userCookie = useCookie('user')
        const jwtToken = useCookie('jwtToken')
        if(!userCookie.value && !jwtToken.value){
          navigateTo('auth/login')
          return
        }
    }

    init()
</script>
<style scoped>

.p-badge {
  display: none;
}
  .trash{
    position: relative;
    bottom: 2px;
  }

 /* width */
::-webkit-scrollbar {
  width: 2px;
}

/* Track */
::-webkit-scrollbar-track {
  border-radius: 10px;
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #B76A3B; 
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #B76A3B; 
}

::-webkit-scrollbar-corner{
  background: #1E1E1E;
}

</style>