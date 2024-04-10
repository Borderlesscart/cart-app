<template>
    <div>
        <div class="sm:text-base text-sm">
            <span>Delivery items</span>
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
                @update-list-item=""
                @update-screen-shot-list=""
                :delivery-list-items-prop="deliveryListItems"
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