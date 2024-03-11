<template>
     <!-- Top header -->
     <NuxtLayout name="dashboard-layout"></NuxtLayout>
     <GeneralNavbar/>

     <div class="mt-10 flex flex-col m-auto text-off-white font-inter w-10/12 pb-14">
        <div class="sm:text-base text-sm">
            <span>Add delivery items</span>
        </div>
        <div class="mt-2 text-xs flex flex-col grow-1 text-login-offwhite">
            <div class="flex mt-2">
            <span class="" >
                List or upload screenshot of goods shipped to our warehouse 
            </span>
            </div>
        </div>

        <div class="sm:text-base text-sm">
            <span>Select country's warehouse you shipped to</span>
        </div>
        <div class="mt-2 text-xs flex flex-col grow-1 text-login-offwhite">
            <div class="flex mt-2">
            <span class="" >
                Select the country of the warehouse you shipped to
            </span>
            </div>
        </div>

        <div class="mt-6 flex flex-wrap grow">
            <GeneralCountries 
            @clicked="(country: Country) => updateCountryAddress(country)"
            />
      </div>
    </div>
</template>
<script setup lang="ts">
    import { ref } from 'vue'
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

    const updateCountryAddress = (selectedCountry: Country) => {
      selectedCountryAddress.value = selectedCountry
    }

</script>