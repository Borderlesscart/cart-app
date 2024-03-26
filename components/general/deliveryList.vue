<template>
    <div v-for="(deliveryItem, key) in deliveryListItems" class="w-full lg:w-8/12 flex ">
            <div class="sm:w-8/12 w-6/12">
              <GeneralSmallTextInput
              name="shipped item"
              place-holder="list shipped item"
              label-name="shipped item"
              :optional="true"
              :auto-focus="key === 0?true:false"
              :intial-value="''"
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
</template>
<script lang="ts" setup>
import { onMounted, ref, toRefs, onBeforeMount } from 'vue';
import FileUpload from 'primevue/fileupload'
import 'primevue/resources/themes/mdc-dark-deeppurple/theme.css'

const props = defineProps({
    deliveryListItemsProp: {
        type: Array,
        default: []
    }
})

const { deliveryListItemsProp } = toRefs(props)
console.log(deliveryListItemsProp)
const emits = defineEmits(['addedListItem', 'uploadedScreenshot'])
const deliveryListItems = ref([
    {
        name: ''
    }
])

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

const userProfileStore = userStore()

onBeforeMount(async () => {
        const userCookie: any = useCookie('user')
        const jwtToken = useCookie('jwtToken')
        if(!userCookie.value && !jwtToken.value){
          navigateTo('auth/login')
          return
        }

        await userProfileStore.getUserDeliveryItems({
        'user_id': userCookie?.value?.id,
        'status': 'pending'
      })
       deliveryListItems.value = userProfileStore.deliveryItems
})
const clearSelectedFile = (formInput: string) => {
      const key = parseInt(formInput.split('_')[1])
      if(isValidFormInput(formInput)){
        validateFormInput(false, formInput)
        sanitizeList(key)
      }

}

const beforeUpload = (data: any) => {
     
}

const deleteListItem = (key: any) => {
      deliveryListItems.value = deliveryListItems.value.filter((item: any, index) => index !== key)
}

const sanitizeList = (key: number) => {
      const list = deliveryListItems.value
      if(list.length > 1){
        deliveryListItems.value = list.filter((item, index) => key !== index)
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

 const isValidFormInput = (formInput: string) => {
      if(validFormFields.value.includes(formInput)){
        return true
      }
      return false
    }
</script>