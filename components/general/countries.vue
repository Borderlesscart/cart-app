<template>
    <div 
        v-for="countryAddress in countryAddresses"
        class="flex flex-col sm:mr-6 mr-4 cursor-pointer"
        @click="updateCountryAddress(countryAddress)"
        >
          <div v-if="isCountriesDisabled">
            <img v-if="countryAddress.code === 'US'" :src="usImgDisabled" class="sm:w-10 w-8 m-auto">
            <img v-if="countryAddress.code === 'UK'" :src="ukImgDisabled" class="sm:w-10 w-8 m-auto">
            <img v-if="countryAddress.code === 'CHINA'" :src="chinaImgDisabled" class="sm:w-10 w-8 m-auto">
          </div>
          <div v-else>
            <div v-if="selectedCountryAddress?.code === countryAddress.code">
              <img v-if="countryAddress.code === 'US'" :src="usImgDisabled" class="sm:w-10 w-8 m-auto">
              <img v-if="countryAddress.code === 'UK'" :src="ukImgDisabled" class="sm:w-10 w-8 m-auto">
              <img v-if="countryAddress.code === 'CHINA'" :src="chinaImgDisabled" class="sm:w-10 w-8 m-auto">
            </div>
            <div v-else>
              <img v-if="countryAddress.code === 'US'" :src="usImg" class="sm:w-10 w-8 m-auto">
              <img v-if="countryAddress.code === 'UK'" :src="ukImg" class="sm:w-10 w-8 m-auto">
              <img v-if="countryAddress.code === 'CHINA'" :src="chinaImg" class="sm:w-10 w-8 m-auto">
            </div>
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
    import usImg from '~/assets/img/us.svg'
    import usImgDisabled from '~/assets/img/us-disabled.svg'
    import ukImg from '~/assets/img/uk.svg'
    import ukImgDisabled from '~/assets/img/uk-disabled.svg'
    import chinaImg from '~/assets/img/china.svg'
    import chinaImgDisabled from '~/assets/img/china-disabled.svg'

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

   const selectedCountryAddress = ref<Country|undefined>(undefined)
   const isCountriesDisabled = ref<Boolean>(false)

   const updateCountryAddress = (countryAddress: Country) => {
    if(!disabled.value){
      selectedCountryAddress.value = countryAddress
      emits('clicked', countryAddress)
    }   
   }

   onMounted(() => {
    selectedCountryAddress.value = countryAddresses.value.find((country: Country) => country.code === selectCountryCode.value)
    isCountriesDisabled.value = disabled.value
   })
</script>