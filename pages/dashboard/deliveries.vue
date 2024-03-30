<template>
     <!-- Top header -->
     <NuxtLayout name="dashboard-layout"></NuxtLayout>
     <GeneralNavbar/>

     <div class="mt-10 m-auto text-off-white font-inter w-10/12 pb-14 max-w-6xl">
      <div v-if="deliveryListItems && deliveryListItems?.length > 1">
        <div class="sm:text-base text-sm">
            <span>Pending delivery items</span>
        </div>
        <div class="text-xs flex flex-col grow-1 text-login-offwhite mb-4">
            <div class="flex mt-2">
            <span class="" >
                List of items we are still looking out for
            </span>
            </div>
        </div>
        <div class="max-h-72 overflow-y-scroll scrollbar">
          <div>
              <div 
                v-for="(listItem, index) in deliveryListItems"
                class="w-full lg:w-8/12 flex mb-2"
              >
              <div 
                class="cursor-pointer px-4 py-2 flex w-10/12 sm:w-8/12 border rounded-lg bg-login-offwhite text-dark justify-between"
              >
                <div class="flex flex-col w-10/12 font-judson">
                  <span class="text-sm pb-1 font-bold">
                    {{ listItem.origin_country }} 
                    to
                    {{ getCountryFullName(listItem.destination_country) }}
                    ~ 
                    <span class="text-xs">
                      {{ formatDate(listItem.created_at) }}
                    </span>
                  </span>
                </div>
                <div class="text-dark-primary text-xs flex m-auto w-2/12">
                  <span>View </span>
                </div>
              </div>

              <div 
                v-if="index === deliveryListItems.length -1"
                class="w-2/12 m-auto cursor-pointer"
                @click="addDeliveryItem()"
              >
                <img src="/img/add.svg" class="w-8 m-auto">
              </div>
              <div
              v-else
              class="w-2/12 m-auto cursor-pointer"
              @click="deleteDeliveryItem(listItem)"
              >
                <img src="/img/trash.svg" class="w-8 m-auto">
              </div>
              
            </div>

          </div>   
          
        </div>
      </div>
      <div v-else>
        <div class="sm:text-base text-sm">
            <span>Add delivery items</span>
        </div>
        <div class="text-xs flex flex-col grow-1 text-login-offwhite mb-4">
            <div class="flex mt-2">
            <span class="" >
                List or upload screenshot of delivery items
            </span>
            </div>
        </div>
        <div class="max-h-44 overflow-y-scroll scrollbar">
          <GeneralDeliveryList
          @added-list-item=""
          @uploaded-screenshot=""
          />
        </div>
        
      </div>
        <!-- <div class="sm:text-base text-sm mt-2">
            <span>Select country's warehouse you shipped to</span>
        </div>
        <div class="text-xs flex flex-col grow-1 text-login-offwhite">
            <div class="flex mt-2">
            <span class="" >
                 The country of the warehouse you shipped to
            </span>
            </div>
        </div> -->

        <!-- <div class="mt-6 flex flex-wrap grow">
            <GeneralCountries 
            @clicked="(country: Country) => updateCountryAddress(country)"
            />
        </div> -->

        <!-- <div class="text-login-offwhite w-10/12 mt-6">
          <div class="">
            <button v-if="!loading" class="text-primary" @click="saveDeliveryItems()">
                 {{ !loading && !itemSaved ? 'Save items': 'Saved' }} 
            </button>
            <button v-else="loading" class="text-primary">
                  Saving...
            </button>
          </div>
        </div> -->

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
    import dayjs from 'dayjs'
    import relativeTime from 'dayjs/plugin/relativeTime'
    dayjs.extend(relativeTime);

    const selectedCountryAddress = ref<any>(null)
    const deliveryListItems = ref<Array<any>>()

    const validFormFields = ref<string[]>([])
    const user = ref({})

    const notification = useNotificationStore()
    const userProfileStore = userStore()
    const loading = ref<boolean>(false)
    const itemSaved = ref<boolean>(false)

    const userCookie: any|undefined = useCookie('user')

    onBeforeMount(async () => {
       
    })

    const formatDate = (date: string) => {
      const now = dayjs()
      return dayjs(date).from(now)
    }

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

    const addDeliveryItem = () => {

    }

    const deleteDeliveryItem = async (item: any) => {
      await userProfileStore.deleteUserDeliveryItem(item.id)
      await getUserDeliveryItems('pending')
    }
    const updateCountryAddress = (selectedCountry: Country) => {
      selectedCountryAddress.value = selectedCountry
    }

    const saveDeliveryItems = async () => {
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

      const storeBulkItems = await userProfileStore.storeBulkDeliveryItem(data)
      loading.value = false
      itemSaved.value = true
    }


    const init = async () => {
        const jwtToken = useCookie('jwtToken')
        if(!userCookie.value && !jwtToken.value){
          navigateTo('auth/login')
          return
        }

       await getUserDeliveryItems('pending')
    }

    const getUserDeliveryItems = async (status: string) => {
      await userProfileStore.getUserDeliveryItems({
        'user_id': userCookie?.value?.id,
        status
      })
       deliveryListItems.value = userProfileStore.deliveryItems
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