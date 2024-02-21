<template>
    <div>
        <label v-if="showLabel" :for="name" class="font-inter text-login-offwhite text-xs">{{labelName}}{{optional?'':'*'}}</label>
        <input 
            class="font-inter rounded w-full bg-dark
            outline-none 
            py-2.5 px-2.5 text-md border border-input-border 
            autofill:bg-dark focus:ring focus:ring-input-border" 
            :class="showLabel? 
            'placeholder-dark-grey text-input-placeholder': 
            'placeholder-input-placeholder text-input-placeholder'
            "
            :type="type" 
            :name="name"
            :placeholder="placeHolder"
            :autofocus="autoFocus"
            :id="name"
            >
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, toRefs } from 'vue';

    const props = defineProps({
        type: {
          type: String,
          default: 'text'  
        },
        name: {
          type: String,
          default: ''  
        },
        placeHolder: {
          type: String,
          default: ''  
        },
        autoFocus: {
            type: Boolean,
            default: false,
            required: false
        },
        showLabel: {
            type: Boolean,
            default: false,
            required: false
        },
        labelName: {
            type: String,
            default: 'Label Name',
            required: false
        },
        optional: {
            type: Boolean,
            default: false
        }
    })

    const { type, name, placeHolder, autoFocus, showLabel, labelName, optional} = toRefs(props)
</script>