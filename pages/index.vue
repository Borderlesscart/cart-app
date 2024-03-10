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
        <div 
        v-for="countryAddress in countryAddresses"
        class="flex flex-col sm:mr-6 mr-4 cursor-pointer"
        @click="updateCountryAddress(countryAddress)"
        >
          <img v-if="selectedCountryAddress.code === countryAddress.code" :src="'img/'+countryAddress.code+'-disabled.svg'" class="sm:w-14 w-12 m-auto">
          <img v-else :src="'img/'+countryAddress.code+'.svg'" class="sm:w-14 w-12 m-auto">
          <span 
            class="text-xs mt-2 text-center"
            :class="selectedCountryAddress.code === countryAddress.code? 'text-primary': 'text-off-white'"
          >{{ countryAddress.name }}</span>
        </div>
      
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

    const uk = {
      id: 2,
      code: 'uk',
      name: 'United Kingdom',
      img: '',
      eta: [
        {
          type: TransportMode.FREIGHT,
          time: '3 days'
        },
        {
          type: TransportMode.SHIP,
          time: '3 weeks'
        },
      ],
      address: {
        full_address: 'Taimbo Cargo <br> 181 Deptford <br> High Street <br> London <br> SE8 3NTa',
        address_breakdown: {
          postcode: 'SE8 3NT',
          short_address: '181 Deptford <br>  High Street <br> London SE8 3NTa',
          city: 'London',
          state: 'England',
          country: 'United Kingdom'
        }
      }
    }

    const china = {
      id: 2,
      code: 'china',
      name: 'China',
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
        full_address: '广州市越秀区广园西路218号盈富商贸城C区069-071档 <br> Shop C069-071 , Ying Fu building ,  No.218 Guang Yuan Xi Rd, Yue Xiu District <br> GuangZhou',
        address_breakdown: {
          postcode: '510000',
          short_address: 'Shop C069-071 , Ying Fu building <br>  No.218 Guang Yuan Xi Rd, Yue Xiu District <br> GuangZhou',
          city: 'Guangzhou',
          state: 'Guangdong',
          country: 'China'
        }
      }
    }

   const countryAddresses = ref<Country[]>([
      us,
      uk,
      china
   ])

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
  