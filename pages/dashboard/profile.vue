<template>
    <!-- Top header -->
    <NuxtLayout name="dashboard-layout"></NuxtLayout>

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

    <div v-if="activeRoute === 'accountDetails'">
        <GeneralUpdateUserProfile/>
    </div>
</template>
<script setup lang="ts">
    import { ref, onMounted } from 'vue'

     // traverse tree to create route list
     const subRouter = ref([ 
      {
        id: 'goBack',
        isActive: false,
        name: 'Home',
      },
      {
        id: 'deliveryAddress',
        isActive: false,
        name: 'Delivery address'
      },
      {
        id: 'accountDetails',
        isActive: true,
        name: 'Account details'
      },
    ])

    const routeList = ref(subRouter.value)

    const activeRoute = ref('accountDetails') //id of active route

    const route = useRoute()    
   

    onMounted(() => {
        const jwtToken = useCookie('jwtToken')
        if(!jwtToken.value){
            navigateTo('/auth/login')
        }

        if(route?.query?.type === 'address'){
            updateActiveRoute('deliveryAddress')
        }else{
            updateActiveRoute('accountDetails')
        }
    })

    watch(
        () => route.query?.type,
        async type => {
            if(type === 'address'){
                updateActiveRoute('deliveryAddress')
            }else{
                updateActiveRoute('accountDetails')
            }
        }
    )

    async function updateActiveRoute(activeRouteId: string, status: boolean = true) {
        if (activeRouteId === 'goBack') {
            navigateTo('/')
        }      
        if(activeRouteId !== activeRoute.value){
          // update subRouter
          activeRoute.value = activeRouteId
          const newSubRouter =  traverseAndUpdateRouteItems(subRouter.value, 0, [])
          const traversed = traverseWrapper(newSubRouter)
          routeList.value = traversed
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

          const t = traverseAndUpdateRouteItems(routeItems, key + 1, [])
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

          if(
            item &&
            !item.hasOwnProperty('childRoute') &&
            item.isActive
        )
        {
            const remainingRouteItems = routeItems.filter((item, index) => index > key)
            return [item, ...remainingRouteItems]
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

          const t = traverseRouteItems(routeItems, key + 1, [])
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
</script>