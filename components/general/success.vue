<template>
<!-- Success component -->
<div class="success-component absolute bottom-12 rounded mt-4 px-6 py-3 text-base  font-inter bg-light-dark flex justify-between">
                <span class="mr-4" v-html="message"></span>
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
        notification.updateSuccess('')
    }

    onMounted(() => {
        if(flash.value === true){
            setTimeout(() => {
                clearMessage()
            }, 3000);
        }
    })

</script>

<style scoped>
    /*  */
    .success-component {
        box-shadow: #00b39f 0.3px -0.8px 5px;
        color: #d1d1d1;
    }
</style>