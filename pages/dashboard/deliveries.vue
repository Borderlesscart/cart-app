<template>
     <!-- Top header -->
     <NuxtLayout name="dashboard-layout"></NuxtLayout>
     <GeneralNavbar/>
    <div class="mt-4 w-10/12 m-auto max-w-6xl">
        <div class="text-xs flex flex-col grow-1 mb-4">
            <div class="flex mt-2">
              <span v-for="(route, key) in routeList" 
              class="text-login-offwhite cursor-pointer"
              :class="route.isActive ? 'text-primary': ''"
              @click="updateActiveRoute(route.id)"
               >
                  {{ route.name }}  <template class="" v-if="key < routeList.length - 1">/ &nbsp;</template>
              </span>
            </div>
        </div>
    </div>
     <div class="mt-4 m-auto text-off-white font-inter w-10/12 pb-14 max-w-6xl">
      <div v-if="deliveryListItems && deliveryListItems?.length > 1 && activeRoute === 'pendingDeliveryItems'">
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

              <div 
                v-for="(listItem, index) in deliveryListItems"
                class="w-full flex justify-between  lg:w-8/12 flex mb-2"
              >
              <div 
                class="cursor-pointer px-4 py-2 flex w-9/12 sm:w-8/12 border rounded-lg bg-login-offwhite text-dark justify-between"
                @click="updateActiveDeliveryList(listItem)"
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
              class="w-3/12 sm:w-2/12 m-auto cursor-pointer flex justify-between"
              @click="deleteDeliveryItem(listItem)"
              >
              <div>
                <img src="/img/trash.svg" class="w-8 m-auto">
              </div>
              <div
              v-if="index === deliveryListItems.length -1"
              @click="updateActiveRoute('addDeliveryItems')"
              class="cursor-pointer mr-4"
              >
                <img src="/img/add.svg" class="w-8 m-auto">
              </div>     
              </div>
            </div>   
        </div>
      </div>

      <div v-if="activeRoute === 'addDeliveryItems'"> 
        <GeneralAddDeliveryList/>  
      </div>

      <div v-if="activeRoute === 'viewDeliveryItem'">
        <GeneralViewDeliveryList
        :delivery-list-items-prop="activeDeliveryList"
        />
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
    import { ref, onMounted, onBeforeMount, watch } from 'vue'
    import type { Country } from '~/types'
    import dayjs from 'dayjs'
    import relativeTime from 'dayjs/plugin/relativeTime'
    import { userStore } from '#imports';
    dayjs.extend(relativeTime);

    const selectedCountryAddress = ref<any>(null)
    const deliveryListItems = ref<Array<any>>()

    const validFormFields = ref<string[]>([])
    const user = ref({})
    
    const loading = ref<boolean>(false)
    const itemSaved = ref<boolean>(false)

    const activeDeliveryList = ref()

    // traverse tree to create route list
    const subRouter = ref([ 
      {
        id: 'pendingDeliveryItems',
        isActive: true,
        name: 'delivery items',
        childRoute: [
          {
            id: 'viewDeliveryItem',
            isActive: false, //if true, display parent route, this and sub route in any
            name: 'view delivery items'
          },
        ]
      },
      {
        id: 'addDeliveryItems',
        isActive: false,
        name: 'add new delivery items'
      },
    ])

    const routeList = ref(subRouter.value)

    const activeRoute = ref('pendingDeliveryItems') //id of active route
    

    const formatDate = (date: string) => {
      const now = dayjs()
      return dayjs(date).from(now)
    }

    const updateActiveDeliveryList = (listItem: any) => {
      const item = listItem.CustomerDeliveryListToCustomerDelivery
      const { CustomerDeliveryListToCustomerDelivery: _, ...delivery } = listItem
     
      let res = []
      for(let i = 0; i < item.length; i++){
        const currVal = item[i]
        res.push(currVal.CustomerDeliveryList)
      }
      activeDeliveryList.value = res

      const userProfileStore: any = userStore()
      userProfileStore.viewDeliveryItems = {
        delivery,
        data: res
      }
      console.log(userProfileStore.viewDeliveryItems)
      updateActiveRoute('viewDeliveryItem')
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
      
      const userProfileStore = userStore()
      await userProfileStore.deleteUserDeliveryItem(item.id)
      await getUserDeliveryItems('pending')
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


    async function updateActiveRoute(activeRouteId: string, status: boolean = true) {
       

        if(activeRouteId !== activeRoute.value){
          // update subRouter
          activeRoute.value = activeRouteId
          const newSubRouter =  traverseAndUpdateRouteItems(subRouter.value, 0, [])
          const traversed = traverseWrapper(newSubRouter)
          routeList.value = traversed
        }

        if(activeRouteId === 'pendingDeliveryItems'){
          await getUserDeliveryItems('pending')
        }
         
        function traverseAndUpdateRouteItems(routeItems: Array<any>, key: number, res: any): any {

          const len = routeItems.length - 1
          if (key > len){
              return []
          }

          let item: any = routeItems[key]
          
          if(item.id === activeRoute.value){
            item.isActive = status
          }else{
            item.isActive = !status
          }

          if(len === key){
              return [item]
            }

          if(item.hasOwnProperty('childRoute')){
            const childRoute = traverseAndUpdateRouteItems(item.childRoute, 0, [])
            item['childRoute'] = childRoute
          }

          res.push(item)

          const t = traverseAndUpdateRouteItems(routeItems, key + 1, res)
          res.push(...t)
          return res
        }
    }

    /**
     * 
     * @param items 
     * 
     * fn(0) = 
     * fn(00) = 
     * 
     * after each recursion, check if true exists in the array/result and if it does, stop the recursion and return result
     */
    function traverseWrapper(items: Array<any>): Array<any> {

      function traverseRouteItems(routeItems: Array<any>, key: number, res: Array<any>)
      {
          const len = routeItems.length - 1
          if (key > len){
              return []
          }

          const item = routeItems[key]

          if (len === key && !item.hasOwnProperty('childRoute'))
          {
              return [item]
          }

          res.push(item)

          if(
              item &&
              item.hasOwnProperty('childRoute') &&
              !item.isActive
          )
          {
              const childRoute = traverseRouteItems(item.childRoute, 0, [])
              if (isTreeBranchActive(childRoute)){
                  res.push(...childRoute)
                  return res
              }
          }

          const t = traverseRouteItems(routeItems, key + 1, res)
          res.push(...t)

          return res
      }

      function isTreeBranchActive(treeBranch: Array<any>): boolean
      {
        const foundNode = treeBranch.find((value) => value.isActive === true)
        if(foundNode){
          return true
        }
        return false
      }

      return traverseRouteItems(items, 0, [])
    }


    const init = async () => {
      const userCookie: any|undefined = useCookie('user')
        const jwtToken = useCookie('jwtToken')
        if(!userCookie.value && !jwtToken.value){
          navigateTo('auth/login')
          return
        }

       await getUserDeliveryItems('pending')
    }

    const getUserDeliveryItems = async (status: string) => {
      const userCookie: any|undefined = useCookie('user')

      const userProfileStore = userStore()
      await userProfileStore.getUserDeliveryItems({
        'user_id': userCookie?.value?.id,
        status
      })
       deliveryListItems.value = userProfileStore.pendingDeliveries
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