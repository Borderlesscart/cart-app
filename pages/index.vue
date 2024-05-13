<template>
    <!-- Top header -->
    <NuxtLayout name="dashboard-layout"></NuxtLayout>
    <GeneralNavbar/>

    <!-- Country select -->
    <div class="mt-10 flex flex-col m-auto text-off-white font-inter w-10/12 pb-14 max-w-6xl">
      <div class="sm:text-base text-sm">
        <span>Select country to ship from</span>
      </div>

      <div class="mt-6 flex flex-wrap grow">
        <GeneralCountries 
          @clicked="(country: Country) => updateCountryAddress(country)"
          select-country-code="US"
        />
      </div>
      <!-- Estimated arrival time to Nigeria -->
      <div class="mt-4 text-xs flex flex-col grow-1 text-login-offwhite">
        <div class="flex mt-2" v-for="eta in selectedCountryAddress.eta">
          <img v-if="eta.type === 'ship'" class="w-6 h-4 mr-2" :src="shipIcon">
          <img v-if="eta.type === 'freight'" class="w-6 h-4 mr-2" :src="freightIcon">
          <span class="" >
            By {{ eta.type }} to Nigeria
            <span class="text-offwhite">
              {{ eta.time }}
            </span>
           </span>
        </div>
      </div>
      <!-- Address block -->
      <div class="mt-8">
        <div><img src="~/assets/img/pin.svg" class="w-4"></div>
        <div class="mt-2 flex sm:w-10/12 md:w-10/12 pb-4 border-b border-dark-grey justify-between font-inter text-offwhite text-sm sm:text-base">
          <div class="capitalize" v-html="selectedCountryAddress.address.full_address"></div>
          <div class=" flex mt-auto cursor-pointer" @click="copy(selectedCountryAddress.address.full_address, 'address.full_address')">
            <img src="~/assets/img/copy.svg" class="w-4 mr-2"> <span class="text-xs">Copy address</span>
          </div>
        </div>
      </div>

     <!-- Address breakdown block  -->
     <div class="mt-14 sm:w-10/12">
      <div class="sm:text-base text-sm">
        <span>Address breakdown</span>
      </div>

      <div class="flex mt-6 flex-wrap justify-start gap-y-8">
        <div class="w-2/6 cursor-pointer"  @click="copy(selectedCountryAddress.address.address_breakdown.postcode, 'address.address_breakdown.postcode')">
          <div class="sm:text-base text-sm"><span>Postcode</span></div>
          <div class="flex sm:text-sm text-xs mt-2">
            <span class="mr-2">{{ selectedCountryAddress.address.address_breakdown.postcode}}</span>
            <img v-if="activeKey === 'address.address_breakdown.postcode'" src="~/assets/img/copied.svg" class="w-4" alt="icon depicting copied image">
            <img v-else src="~/assets/img/copy.svg" class="w-4">
          </div>
        </div>

        <div class="w-2/6 cursor-pointer"  @click="copy(selectedCountryAddress.address.address_breakdown.short_address, 'address.address_breakdown.short_address')">
          <div class="sm:text-base text-sm"><span>Address</span></div>
          <div class="flex sm:text-sm text-xs mt-2">
            <span class="mr-2" v-html="selectedCountryAddress.address.address_breakdown.short_address">
            </span>
            <img v-if="activeKey === 'address.address_breakdown.short_address'" src="~/assets/img/copied.svg" class="w-4" alt="icon depicting copied image">
            <img v-else src="~/assets/img/copy.svg" class="w-4">
          </div>
        </div>

        <div class="w-2/6 cursor-pointer"  @click="copy(selectedCountryAddress.address.address_breakdown.city, 'address.address_breakdown.city')">
          <div class="sm:text-base text-sm"><span>City</span></div>
          <div class="flex sm:text-sm text-xs mt-2">
            <span class="mr-2">{{ selectedCountryAddress.address.address_breakdown.city }}</span>
            <img v-if="activeKey === 'address.address_breakdown.city'" src="~/assets/img/copied.svg" class="w-4" alt="icon depicting copied image">
            <img v-else src="~/assets/img/copy.svg" class="w-4">
          </div>
        </div>

        <div class="w-2/6 cursor-pointer"  @click="copy(selectedCountryAddress.address.address_breakdown.state, 'address.address_breakdown.state')">
          <div class="sm:text-base text-sm"><span>State</span></div>
          <div class="flex sm:text-sm text-xs mt-2">
            <span class="mr-2">{{ selectedCountryAddress.address.address_breakdown.state }}</span>
            <img v-if="activeKey === 'address.address_breakdown.state'" src="~/assets/img/copied.svg" class="w-4" alt="icon depicting copied image">
            <img v-else src="~/assets/img/copy.svg" class="w-4">
          </div>
        </div>

        <div class="w-2/6 cursor-pointer"  @click="copy(selectedCountryAddress.address.address_breakdown.country, 'address.address_breakdown.country')">
          <div class="sm:text-base text-sm"><span>Country</span></div>
          <div class="flex sm:text-sm text-xs mt-2">
            <span class="mr-2">{{ selectedCountryAddress.address.address_breakdown.country }}</span>
            <img v-if="activeKey === 'address.address_breakdown.country'" src="~/assets/img/copied.svg" class="w-4" alt="icon depicting copied image">
            <img v-else src="~/assets/img/copy.svg" class="w-4">
          </div>
        </div>

      </div>
     </div>
    </div>
</template>
<script lang="ts" setup>
   import { onMounted, ref, toRefs, onBeforeMount} from 'vue';
   import type { Country } from '~/types'
   import { Us } from '~/consts';
   import shipIcon from '~/assets/img/ship.svg'
   import freightIcon from '~/assets/img/freight.svg'

   const selectedCountryAddress = ref<Country>(Us)
   const activeKey = ref<string|null>(null)

   const notification = useNotificationStore()

   onMounted(() => {
        const user = useCookie('user')
        const jwtToken = useCookie('jwtToken')
    })

    onBeforeMount(() => {
      const jwtToken = useCookie('jwtToken')
      if(!jwtToken.value){
        navigateTo('/auth/login')
      }
    })

    const updateCountryAddress = (selectedCountry: Country) => {
      selectedCountryAddress.value = selectedCountry
    }

    const copy = (value: string, activeKeyIndex: string) => {
      navigator.clipboard.writeText(stripHtml(value))
      if(activeKeyIndex !== activeKey.value){
        activeKey.value = activeKeyIndex
      }
    }

    function stripHtml(html: string){
      let tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    }

</script>
  