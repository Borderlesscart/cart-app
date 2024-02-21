<template>
    <button @click.prevent="buttonClicked()" class="font-judson text-light-grey py-2.5 text-lg w-full bg-button-color rounded">
        {{ name }}
    </button>
</template>
<script setup lang="ts">
    import { onMounted, ref, toRefs } from 'vue';

    const props = defineProps({
        name: {
            type: String,
            default: 'button name'
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