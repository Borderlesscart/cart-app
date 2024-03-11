<template>
    <!-- Top header -->
    <NuxtLayout name="dashboard-layout"></NuxtLayout>
    <GeneralNavbar/>

    <!-- Country select -->
    <div class="mt-10 flex flex-col m-auto text-off-white font-inter w-10/12 pb-14">
      <div class="sm:text-base text-sm">
        <span>Select country to ship from</span>
      </div>

      <div class="mt-6 flex flex-wrap grow">
        <GeneralCountries 
          @clicked="(country: Country) => updateCountryAddress(country)"
          select-country-code="us"
        />
      </div>
      <!-- Estimated arrival time to Nigeria -->
      <div class="mt-4 text-xs flex flex-col grow-1 text-login-offwhite">
        <div class="flex mt-2" v-for="eta in selectedCountryAddress.eta">
          <img class="w-6 h-4 mr-2" :src="'img/'+eta.type+'.svg'">
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
        <div><img src="img/pin.svg" class="w-4"></div>
        <div class="mt-2 flex sm:w-10/12 md:w-10/12 pb-4 border-b border-dark-grey justify-between font-inter text-offwhite text-sm sm:text-base">
          <div class="capitalize" v-html="selectedCountryAddress.address.full_address"></div>
          <div class=" flex mt-auto cursor-pointer" @click="copy(selectedCountryAddress.address.full_address)">
            <img src="img/copy.svg" class="w-4 mr-2"> <span class="text-xs">Copy address</span>
          </div>
        </div>
      </div>

     <!-- Address breakdown block  -->
     <div class="mt-14 sm:w-10/12">
      <div class="sm:text-base text-sm">
        <span>Address breakdown</span>
      </div>

      <div class="flex mt-6 flex-wrap justify-start gap-y-8">
        <div class="w-2/6 cursor-pointer"  @click="copy(selectedCountryAddress.address.address_breakdown.postcode)">
          <div class="sm:text-base text-sm"><span>Postcode</span></div>
          <div class="flex sm:text-sm text-xs mt-2">
            <span class="mr-2">{{ selectedCountryAddress.address.address_breakdown.postcode}}</span>
            <img src="img/copy.svg" class="w-4">
          </div>
        </div>

        <div class="w-2/6 cursor-pointer"  @click="copy(selectedCountryAddress.address.address_breakdown.short_address)">
          <div class="sm:text-base text-sm"><span>Address</span></div>
          <div class="flex sm:text-sm text-xs mt-2">
            <span class="mr-2" v-html="selectedCountryAddress.address.address_breakdown.short_address">
            </span>
            <img src="img/copy.svg" class="w-4">
          </div>
        </div>

        <div class="w-2/6 cursor-pointer"  @click="copy(selectedCountryAddress.address.address_breakdown.city)">
          <div class="sm:text-base text-sm"><span>City</span></div>
          <div class="flex sm:text-sm text-xs mt-2">
            <span class="mr-2">{{ selectedCountryAddress.address.address_breakdown.city }}</span>
            <img src="img/copy.svg" class="w-4">
          </div>
        </div>

        <div class="w-2/6 cursor-pointer"  @click="copy(selectedCountryAddress.address.address_breakdown.state)">
          <div class="sm:text-base text-sm"><span>State</span></div>
          <div class="flex sm:text-sm text-xs mt-2">
            <span class="mr-2">{{ selectedCountryAddress.address.address_breakdown.state }}</span>
            <img src="img/copy.svg" class="w-4">
          </div>
        </div>

        <div class="w-2/6 cursor-pointer"  @click="copy(selectedCountryAddress.address.address_breakdown.country)">
          <div class="sm:text-base text-sm"><span>Country</span></div>
          <div class="flex sm:text-sm text-xs mt-2">
            <span class="mr-2">{{ selectedCountryAddress.address.address_breakdown.country }}</span>
            <img src="img/copy.svg" class="w-4">
          </div>
        </div>

      </div>
     </div>
    </div>
</template>
<script lang="ts" setup>
   import { onMounted, ref, toRefs, onBeforeMount} from 'vue';
   import type { Country } from '~/types'
   import { TransportMode } from '~/types'

   const us = {
      id: 1,
      code: 'us',
      name: 'United States',
      img: '',
      eta: [
        {
          type: TransportMode.FREIGHT,
          time: '7 days'
        },
        {
          type: TransportMode.SHIP,
          time: '6 weeks'
        },
      ],
      address: {
        full_address: '6261 South Highway 6S <br> Houston Texas 77083 <br> United states of America',
        address_breakdown: {
          postcode: '77083',
          short_address: '6261 South Highway 6S <br> Houston Texas 77083',
          city: 'Houston',
          state: 'Texas',
          country: 'United states of America'
        }
      }
    }

   const selectedCountryAddress = ref<Country>(us)

   const notification = useNotificationStore()

   onMounted(() => {
        const user = useCookie('user')
        const jwtToken = useCookie('jwtToken')
    })

    onBeforeMount(() => {
      const jwtToken = useCookie('jwtToken')
      if(!jwtToken.value){
        navigateTo('auth/login')
      }
    })

    const updateCountryAddress = (selectedCountry: Country) => {
      selectedCountryAddress.value = selectedCountry
    }

    const copy = (value: string) => {
      navigator.clipboard.writeText(stripHtml(value))
      notification.updateSuccess('copied')
    }

    function stripHtml(html: string){
      let tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    }

</script>
  