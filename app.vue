<script setup lang="ts">
import { onMounted } from 'vue';
  const title = ref('Borderless cart - Ship goods from abroad to Nigeria')

  const notificationStore = useNotificationStore()
  const userProfileStore: any = userStore()

  onMounted(async () => {
    const userCookie: any|undefined = useCookie('user')

    await userProfileStore.getUserDeliveryItems({
      'user_id': userCookie?.value?.id,
      status: 'pending'
    })

    const deliveryAddress: any = userCookie.value.addresses?.find((address: any) => address.type === 'address_type')
    if(userProfileStore.pendingDeliveries.length > 0 && !deliveryAddress){
      const message = "<div class='flex flex-col'><span class='class='font-judson text-2xl''>👋🏾 Add your shipping address <a href='/dashboard/profile?type=address' class='text-primary cursor-pointer'>here</a></span><span class='font-inter text-sm mt-2 text-center text-login-offwhite'>We will send your items to this address</span></div>"
      notificationStore.updateSuccess(message, false)
    }
  })

</script>

<template>
  <div>
    <Head>
      <Title>{{ title }}</Title>
      <Link rel="preconnect" href="https://fonts.googleapis.com" />
      <Link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter&display=swap" />
      <Link rel="icon" href="/img/favicon.svg" type="image/x-icon" />

      <Link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
      <Link href="https://fonts.googleapis.com/css2?family=Judson&display=swap" rel="stylesheet" />
    </Head>
    <NuxtPage />

    <div 
      v-if="notificationStore.error.message"
      class="w-11/12 sm:w-10/12 flex mx-auto">
      <GeneralError 
      :message="notificationStore.error.message"
      :flash="notificationStore.error.flash"/>
    </div>   
    <div 
    v-if="notificationStore.success.message"
    class="w-11/12 sm:w-10/12 flex mx-auto">
      <GeneralSuccess
      :message="notificationStore.success.message"
      :flash="notificationStore.success.flash"/>
    </div> 
  </div>
</template>
