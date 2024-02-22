<template>
    <button 
    @click.prevent="buttonClicked()" 
    class="font-judson py-2.5 text-lg w-full rounded"
    :class="disabled?'bg-btn-disabled-color text-login-offwhite':'bg-button-color text-light-grey'"
    :disabled="disabled"
    >
        {{ name }}
    </button>
</template>
<script setup lang="ts">
    import { onMounted, ref, toRefs } from 'vue';

    const props = defineProps({
        name: {
            type: String,
            default: 'button name'
        },
        disabled: {
            type: Boolean,
            default: false
        }
    })

    const emits = defineEmits([
        'clicked'
    ])

    const { name } = toRefs(props)

    const buttonClicked = () => {
        emits('clicked')
    }
</script>