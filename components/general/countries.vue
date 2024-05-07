<template>
    <div 
        v-for="countryAddress in countryAddresses"
        class="flex flex-col sm:mr-6 mr-4 cursor-pointer"
        @click="updateCountryAddress(countryAddress)"
        >
          <div v-if="isCountriesDisabled">
            <img :src="'~/assets/img/'+countryAddress.code.toLowerCase()+'-disabled.svg'" class="sm:w-10 w-8 m-auto">
          </div>
          <div v-else>
            <img v-if="selectedCountryAddress?.code === countryAddress.code" :src="'~/assets/img/'+countryAddress.code.toLowerCase()+'-disabled.svg'" class="sm:w-10 w-8 m-auto">
            <img v-else :src="'~/assets/img/'+countryAddress.code.toLowerCase()+'.svg'" class="sm:w-10 w-8 m-auto">
          </div>
               
          <span 
            v-if="isCountriesDisabled"
            class="text-xs mt-2 text-center"
            :class="selectedCountryAddress?.code === countryAddress.code? 'text-primary': 'text-login-offwhite'"
          >{{ countryAddress.name }}</span>
          <span 
            v-else
            class="text-xs mt-2 text-center"
            :class="selectedCountryAddress?.code === countryAddress.code? 'text-primary': 'text-off-white'"
          >{{ countryAddress.name }}</span>

        </div>
</template>
<script lang="ts" setup>
    import { ref } from 'vue'
    import { CountryAddresses } from '~/consts';
    import type { Country } from '~/types'

    const emits = defineEmits([
        'clicked'
    ])

    const props = defineProps({
        selectCountryCode: {
          type: String,
          default: '',
          
        },
        disabled: {
          type: Boolean,
          default: false
        }
    })

    const { selectCountryCode, disabled } = toRefs(props)


   const countryAddresses = ref<Country[]>(CountryAddresses)

   const selectedCountryAddress = ref<Country|undefined>(countryAddresses.value.find((country: Country) => country.code === selectCountryCode.value))
   const isCountriesDisabled = ref<Boolean>(disabled.value)

   const updateCountryAddress = (countryAddress: Country) => {
    if(!disabled.value){
      selectedCountryAddress.value = countryAddress
      emits('clicked', countryAddress)
    }   
   }
</script>