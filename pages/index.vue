<template>
    <!-- Top header -->
    <NuxtLayout name="dashboard-layout"></NuxtLayout>

    <!-- Nav bar -->
    <div class="w-10/12 border-b border-dark-grey flex mt-16 m-auto text-off-white justify-between sm:justify-around sm:text-base text-sm">
      <div class="cursor-pointer primary-color border-b primary-color-border font-inter"><NuxtLink to="#">Get shipping address</NuxtLink></div>
      <div class="cursor-pointer font-inter"><NuxtLink to="#">Deliveries</NuxtLink></div>
      <!-- <div class="cursor-pointer font-inter"><span>Exchange rate</span></div> -->
    </div>

    <!-- Country select -->
    <div class="mt-10 flex flex-col m-auto text-off-white font-inter w-10/12 pb-14">
      <div class="sm:text-base text-sm">
        <span>Select country to ship from</span>
      </div>
      <div class="mt-6 flex flex-wrap grow">
        <div class="flex flex-col sm:mr-6 mr-4 cursor-pointer">
          <img src="img/united-states.svg" class="sm:w-14 w-12 m-auto">
          <span class="text-xs mt-2">United states</span>
        </div>
        <div class="flex flex-col sm:mr-6 mr-4 cursor-pointer">
          <img src="img/united-kingdom.svg" class="sm:w-14 w-12 m-auto">
          <span class="text-xs mt-2">United kingdom</span>
        </div>
        <div class="flex flex-col cursor-pointer">
          <img src="img/china.svg" class="sm:w-14 w-12 m-auto">
          <span class="text-xs mt-2">United states</span>
        </div>
      </div>
      <!-- Estimated arrival time to Nigeria -->
      <div class="mt-10  text-xs text-primary">
        <span>Expected time of arrival to Nigeria is 7 days</span>
      </div>
      <!-- Address block -->
      <div class="mt-10">
        <div><img src="img/pin.svg" class="w-4"></div>
        <div class="mt-2 flex sm:w-10/12 md:w-10/12 pb-4 border-b border-dark-grey justify-between font-inter text-offwhite text-sm sm:text-base">
          <div>
            <span>
              6261 South Highway 6S<br>
              Houston Texas 77083<br>     
              United states of America
            </span>
          </div>
          <div class="flex mt-auto cursor-pointer">
            <img src="img/copy.svg" class="w-4 mr-2"> <span class="text-xs">Copy address</span>
          </div>
        </div>
      </div>

     <!-- Address breakdown block  -->
     <div class="mt-14 sm:w-10/12">
      <div class="sm:text-base text-sm">
        <span>Address breakdown</span>
      </div>

      <div class="flex sm:w-10/12 mt-6 flex-wrap justify-between gap-y-8">
        <div>
          <div class="sm:text-base text-sm"><span>Postcode</span></div>
          <div class="flex sm:text-sm text-xs mt-2">
            <span class="mr-2">77083</span>
            <img src="img/copy.svg" class="w-4">
          </div>
        </div>

        <div>
          <div class="sm:text-base text-sm"><span>Address</span></div>
          <div class="flex sm:text-sm text-xs mt-2">
            <span class="mr-2">
              6261 South Highway 6S<br>
              Houston Texas 77083
            </span>
            <img src="img/copy.svg" class="w-4">
          </div>
        </div>

        <div>
          <div class="sm:text-base text-sm"><span>City</span></div>
          <div class="flex sm:text-sm text-xs mt-2">
            <span class="mr-2">Houston</span>
            <img src="img/copy.svg" class="w-4">
          </div>
        </div>

        <div>
          <div class="sm:text-base text-sm"><span>State</span></div>
          <div class="flex sm:text-sm text-xs mt-2">
            <span class="mr-2">Texas</span>
            <img src="img/copy.svg" class="w-4">
          </div>
        </div>

        <div>
          <div class="sm:text-base text-sm"><span>Country</span></div>
          <div class="flex sm:text-sm text-xs mt-2">
            <span class="mr-2">United States of America</span>
            <img src="img/copy.svg" class="w-4">
          </div>
        </div>

      </div>
     </div>
    </div>
</template>
<script lang="ts" setup>
   import { onMounted, ref, toRefs, onBeforeMount} from 'vue';

   onMounted(() => {
        const user = useCookie('user')
        const jwtToken = useCookie('jwtToken')
        // if(!jwtToken.value){
        //     // navigateTo('auth/login')
        // }
        console.log(user.value, jwtToken.value)
    })

    onBeforeMount(() => {
      const jwtToken = useCookie('jwtToken')
      if(!jwtToken.value){
        navigateTo('auth/login')
      }
    })
</script>
  