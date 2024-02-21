<script setup lang="ts">
  const title = ref('Borderless cart - Ship goods from abroad to Nigeria')
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
  
  </div>
</template>
