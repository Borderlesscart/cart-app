<template>
    <div>
        <div class="sm:text-base text-sm">
          <span>
           {{ deliveryOption.origin_country }}
            to
          </span>
          <span>
            {{ getCountryFullName(deliveryOption.destination_country) }}
            ~ 
                    <span class="text-xs">
                      {{ formatDate(deliveryOption.created_at) }}
                    </span>
          </span>
        </div>

        <div class="">
            <GeneralDeliveryList
                @update-list-item=""
                @update-screen-shot-list=""
                :delivery-list-items-prop="deliveryListItems"
                :delivery-upload-items-prop="deliveryUploadItems"
                :page="'viewDelivery'"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
    import { ref, onMounted, onBeforeMount } from 'vue'
    import { useCookie } from 'nuxt/app';
    import type { Country } from '~/types'
    import dayjs from 'dayjs'
    import relativeTime from 'dayjs/plugin/relativeTime'
    dayjs.extend(relativeTime);

    const props = defineProps({
        deliveryListItemsProp: {
            type: Array,
            required: true,
        }
    })

    const { deliveryListItemsProp } = toRefs(props)

    const selectedCountryAddress = ref<any>(null)
   
    const loading = ref<boolean>(false)
    const itemSaved = ref<boolean>(false)
    const user = ref({})
    const deliveryListItems = ref<Array<any>>(deliveryListItemsProp.value)
    const validFormFields = ref<string[]>([])
    const deliveryUploadItems = ref<Array<any>>([])

    const deliveryOption = ref<any>({
      id: null
    })

    const userProfileStore = userStore()

    const init = () => {
      deliveryUploadItems.value = deliveryListItems.value.filter(item => {
        if(item.image_list_link){
          return item
        }
      })

      deliveryListItems.value = deliveryListItems.value.filter(item => {
        if(!item.image_list_link){
          return item
        }
      })

      const option = userProfileStore.viewDeliveryItems.delivery
      deliveryOption.value = option
    }

    init()

    const getCountryFullName = (code: string) => {
      if(code === 'US'){
          return 'United States'
        }

        if(code === 'UK'){
          return'United Kingdom'
        }

        if(code === 'NG'){
          return 'Nigeria'
        }

        if(code === 'Ch'){
          return 'China'
        }
    }

    const formatDate = (date: string) => {
      const now = dayjs()
      return dayjs(date).from(now)
    }

    const updateCountryAddress = (selectedCountry: Country) => {
      selectedCountryAddress.value = selectedCountry
    }

    const saveDeliveryItems = async () => {
      const notification = useNotificationStore()
      const userCookie: any|undefined = useCookie('user')
      const totalDeliveryItem = deliveryListItems.value?.length
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
      const userProfileStore = userStore()
      const storeBulkItems = await userProfileStore.storeBulkDeliveryItem(data)
      loading.value = false
      itemSaved.value = true
    }
</script>