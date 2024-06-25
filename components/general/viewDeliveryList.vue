<template>
    <div>
        <div class="sm:text-base text-sm">
          <span>
           {{ deliveryOption.origin_country }}
            to
          </span>
          <span>
            {{ getCountryFullName(deliveryOption.destination_country) }}
            ~ 
                    <span class="text-xs">
                      {{ formatDate(deliveryOption.created_at) }}
                    </span>
          </span>
        </div>

        <div class="">
            <GeneralDeliveryList
                @update-list-item=""
                @update-screen-shot-list=""
                @mounted="() => { $emit('mounted')}"
                @un-mounted="() => { $emit('unMounted')}"
                :delivery-list-items-prop="deliveryListItems"
                :delivery-upload-items-prop="deliveryUploadItems"
                :page="'viewDelivery'"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
    import { ref, onMounted, onBeforeMount } from 'vue'
    import { useCookie } from 'nuxt/app';
    import type { Country } from '~/types'
    import dayjs from 'dayjs'
    import relativeTime from 'dayjs/plugin/relativeTime'
    dayjs.extend(relativeTime);

    const props = defineProps({
        deliveryListItemsProp: {
            type: Array,
            required: true,
        }
    })

    const emits = defineEmits(['mounted', 'unMounted'])

    const { deliveryListItemsProp } = toRefs(props)
   
    const deliveryListItems = ref<Array<any>>(deliveryListItemsProp.value)

    const deliveryUploadItems = ref<Array<any>>([])

    const deliveryOption = ref<any>({
      id: null
    })

    const userProfileStore = userStore()

    onBeforeMount(() => {
      deliveryUploadItems.value = deliveryListItems.value.filter(item => {
        if(item.image_list_link){
          return item
        }
      })

      deliveryListItems.value = deliveryListItems.value.filter(item => {
        if(!item.image_list_link){
          return item
        }
      })

      const option = userProfileStore.viewDeliveryItems.delivery
      deliveryOption.value = option
    })

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

    const formatDate = (date: string) => {
      const now = dayjs()
      return dayjs(date).from(now)
    }

</script>