<template>
<!-- Error component -->
<div class="error-component absolute bottom-12 sm:w-96 w-11/12 rounded mt-4 px-6 py-3 text-base text-primary font-inter bg-light-dark flex justify-between">
                <span>
                    {{ message }}
                </span>
                <button @click="clearMessage()">
                    <img src="/img/cancel.svg" class="h-6 w-6"/>
                </button>         
            </div>
</template>
<script lang="ts" setup>
    import { onMounted, ref, toRefs } from 'vue';

     const props = defineProps({
        message: {
            type: String,
            default: '',
            required: true
        },
        flash: {
            type: Boolean,
            default: true
        }
    })

    const { message, flash } = toRefs(props)

    const notification = useNotificationStore()

    const clearMessage = () => {
        notification.updateError('')
    }

    onMounted(() => {
        if(flash.value){
            setTimeout(() => {
                clearMessage()
            }, 3000);
        }
    })

</script>
<style scoped>
    .error-component {
        box-shadow: #B76A3B 0.3px -0.8px 5px;
    }

</style>