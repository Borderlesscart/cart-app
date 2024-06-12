<script setup lang="ts">
  const title = ref('Borderless cart - Ship goods from abroad to Nigeria')
  const notificationStore = useNotificationStore()
  const userProfileStore = userStore()

  onBeforeMount(() => {
      const jwtToken = useCookie('jwtToken')
      if(!jwtToken.value){
        navigateTo('/auth/login')
      }
  })
</script>

<template>
  <div>
    <Head>
      <Title>{{ title }}</Title>
      <Link rel="preconnect" href="https://fonts.googleapis.com" />
      <Link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter&display=swap" />
      <Link rel="icon" href="/favicon.svg" type="image/x-icon" />

      <Link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
      <Link href="https://fonts.googleapis.com/css2?family=Judson&display=swap" rel="stylesheet" />
    </Head>
    <NuxtPage />

    <div 
      v-if="notificationStore.error.message"
      class="w-11/12 sm:w-10/12 flex mx-auto"
    >
      <GeneralError 
      :message="notificationStore.error.message"
      :flash="notificationStore.error.flash"/>
    </div>

    <div 
    v-if="notificationStore.success.message"
    class="w-11/12 sm:w-10/12 flex mx-auto"
    >
      <GeneralSuccess
      :message="notificationStore.success.message"
      :flash="notificationStore.success.flash"/>
    </div>

    <div
    v-if="userProfileStore.showAddShippingAddressNotification && !notificationStore.success.message && !notificationStore.error.message"
    class="w-11/12 sm:w-10/12 flex mx-auto"
    >
      <GeneralWelcome/>
    </div>

  </div>
</template>
