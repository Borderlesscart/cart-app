<template>
     <!-- Top header -->
     <NuxtLayout name="dashboard-layout"></NuxtLayout>

     <GeneralNavbar/>

<!-- Local Nav  -->
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
<!-- End of Local Nav -->

     <div class="mt-4 m-auto text-off-white font-inter w-10/12 pb-14 max-w-6xl">
      <ConfirmPopup
      :pt="confirmPopupStyle"
      >
      </ConfirmPopup>
      <!-- When making network calls for delivery items for the first time-->
      <div v-if="loading && deliveryListItems.length === 0" class="text-xs flex flex-col grow-1  mb-4">
          <div class="flex mt-2">
            <span class="text-login-offwhite" >
                loading...
            </span>
          </div>
      </div>

      <!-- When no delivery list item added -->
      <div v-if="!loading && deliveryListItems.length === 0 && activeRoute === 'pendingDeliveryItems'">
        <div class="text-xs flex flex-col grow-1  mb-4">
          <div class="flex mt-2">
            <span class="text-login-offwhite" >
                No delivery items yet. <span class="primary-color" @click="updateActiveRoute('addDeliveryItems')">Add here</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Start of pending delivery || for when number of delivery items is greater than 1-->
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
                class="cursor-pointer px-4 py-2 flex w-9/12 sm:w-8/12 border border-dark-grey rounded-lg bg-light-dark-background text-off-white justify-between"
                @click="updateActiveDeliveryList(listItem)"
              >
                <div class="flex flex-col w-10/12 font-judson">
                  <span class="text-sm pb-1 font-bold ">
                    {{ listItem.origin_country }} 
                    to
                    {{ getCountryFullName(listItem.destination_country) }}
                    <span class="text-login-offwhite">
                      ~
                      <span class="text-xs">
                        {{ formatDate(listItem.created_at) }}
                      </span>
                    </span>
                    
                  </span>
                </div>
                <div class="text-dark-primary text-xs flex m-auto w-2/12">
                  <span>View </span>
                </div>
              </div>

              
                <div
                class="w-3/12 sm:w-2/12 m-auto cursor-pointer flex justify-between"
                
                >
                  <button v-if="!loading"
                  @click="initiateDeleteDeliveryItem($event, listItem)"
                  >
                    <img :src="trashImg" class="w-8 m-auto">
                  </button>
                  <button v-else
                  @click="initiateDeleteDeliveryItem($event, listItem)">
                    <img :src="trashDisabledImg" class="w-8 m-auto">
                  </button>
                  <div
                  v-if="index === deliveryListItems.length -1"
                  @click="updateActiveRoute('addDeliveryItems')"
                  class="cursor-pointer mr-4"
                  >
                    <img :src="addImg" class="w-8 m-auto">
                  </div>     
                </div>
             
            </div>   
            
        </div>
        
      </div>
      <!-- End of pending delivery -->

      <!-- View delivery items for single pending list item -->
      <div v-if="deliveryListItems && deliveryListItems?.length === 1 && activeRoute === 'pendingDeliveryItems'"> 
        <GeneralViewDeliveryList
        v-if="activeDeliveryList.length > 0"
        :delivery-list-items-prop="activeDeliveryList"
        />
      </div>

      <!-- Add new delivery list -->
      <div v-if="activeRoute === 'addDeliveryItems'"> 
        <GeneralAddDeliveryList/>  
      </div>

       
      <!-- View and edit delivery list -->
      <div v-if="activeRoute === 'viewDeliveryItem'">
        
        <GeneralViewDeliveryList
        :delivery-list-items-prop="activeDeliveryList"
        />
      </div>
   
        <div class="text-xs flex flex-col grow-1 text-login-offwhite absolute bottom-10 w-10/12">
            <div class="flex mt-2 mr">
              <img :src="messageImg" class="w-4 mr-2"/>
              <span class="" >
                  We will notify you once we receive your package
              </span>  
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { ref } from 'vue'
    import dayjs from 'dayjs'
    import relativeTime from 'dayjs/plugin/relativeTime'
    dayjs.extend(relativeTime);

    import messageImg from '~/assets/img/message.svg'
    import trashImg from '~/assets/img/trash.svg'
    import trashDisabledImg from '~/assets/img/trash-disabled.svg'
    import addImg from '~/assets/img/add.svg'
    import { useConfirm } from 'primevue/useconfirm';
    import 'primevue/resources/themes/mdc-dark-deeppurple/theme.css'

    const deliveryListItems = ref<Array<any>>([])

    const loading = ref<boolean>(false)

    const activeDeliveryList = ref<Array<any>>([])

    const confirmPopupStyle = ref({
      root: 'font-inter'
    })

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

    const populateActiveDeliveryList = (listItem: any) => {
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
        data: activeDeliveryList.value
      }
    }

    const updateActiveDeliveryList = (listItem: any) => {
      populateActiveDeliveryList(listItem)
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

    const confirm = useConfirm()
    const initiateDeleteDeliveryItem = async (event: any, item: any) => {
      confirm.require({
        target: event.currentTarget,
        message: 'Are you sure you want to delete this item?',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-sm',
        rejectLabel: 'Cancel',
        acceptLabel: 'Delete',
        accept: async () => {
          await deleteDeliveryItem(item)
        },
        reject: async () => {
          console.log('reject')
        }
      });
    }

    const deleteDeliveryItem = async (item: any) => {
      loading.value = true
      const userProfileStore = userStore()
      await userProfileStore.deleteUserDeliveryItem(item.id)
      await getUserDeliveryItems('pending')
      loading.value = false
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

          if(deliveryListItems.value.length === 1){
            populateActiveDeliveryList(deliveryListItems.value[0])
          }
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


    onBeforeMount(async () => {
        const userCookie: any|undefined = useCookie('user')
        const jwtToken = useCookie('jwtToken')

        if(!userCookie.value || !jwtToken.value){
          navigateTo('/auth/login')
          return
        }

       await getUserDeliveryItems('pending')

       if(deliveryListItems.value.length === 0){
        updateActiveRoute('addDeliveryItems')
       }

       if(deliveryListItems.value.length === 1){
        populateActiveDeliveryList(deliveryListItems.value[0])
       }
    })


    const getUserDeliveryItems = async (status: string) => {
      try{
        loading.value = true

        const userCookie: any|undefined = useCookie('user')
        const userProfileStore = userStore()
        await userProfileStore.getUserDeliveryItems({
          'user_id': userCookie?.value?.id,
          status
        })
        deliveryListItems.value = userProfileStore.pendingDeliveries

        //  Display add shipping notification
        const notificationStore = useNotificationStore()
        const deliveryAddress: any = userCookie.value.addresses?.find((address: any) => address.address_type === 'shipping')
  
        if(deliveryListItems.value.length > 0 && !deliveryAddress){
          const message = "<div class='flex flex-col'><span class='class='font-judson text-2xl''>👋🏾 Add your shipping address <a href='/dashboard/profile?type=address' class='text-primary cursor-pointer'>here</a></span><span class='font-inter text-sm mt-2 text-center text-login-offwhite'>We will send your items to this address</span></div>"
          notificationStore.updateSuccess(message, false)
        }

        loading.value = false
      }catch(error){
        loading.value = false
      }
    }
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