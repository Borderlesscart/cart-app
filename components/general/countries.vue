<template>
    <div 
        v-for="countryAddress in countryAddresses"
        class="flex flex-col sm:mr-6 mr-4 cursor-pointer"
        @click="updateCountryAddress(countryAddress)"
        >
          <img v-if="selectedCountryAddress?.code === countryAddress.code" :src="'/img/'+countryAddress.code+'-disabled.svg'" class="sm:w-14 w-12 m-auto">
          <img v-else :src="'/img/'+countryAddress.code+'.svg'" class="sm:w-14 w-12 m-auto">
          <span 
            class="text-xs mt-2 text-center"
            :class="selectedCountryAddress?.code === countryAddress.code? 'text-primary': 'text-off-white'"
          >{{ countryAddress.name }}</span>
        </div>
</template>
<script lang="ts" setup>
    import { ref, defineEmits, defineProps } from 'vue'
    import type { Country } from '~/types'
    import { TransportMode } from '~/types'

    const emits = defineEmits([
        'clicked'
    ])

    const props = defineProps({
        selectCountryCode: {
          type: String,
          default: '',
          
        },
    })

    const { selectCountryCode } = toRefs(props)

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

   const selectedCountryAddress = ref<Country|undefined>(countryAddresses.value.find((country: Country) => country.code === selectCountryCode.value))

   const updateCountryAddress = (countryAddress: Country) => {
    selectedCountryAddress.value = countryAddress
    emits('clicked', countryAddress)
   }
</script>