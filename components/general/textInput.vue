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
            v-model="computedInputValue"
            >
        <span v-if="!optional && (formSubmitted || isInputDirty)" class="font-inter text-xs text-primary">{{ errors.required }}</span> &nbsp;
        <span v-if="formSubmitted && !optional || !isValidEmail" class="font-inter text-xs text-primary">{{ errors.is_email }}</span>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, toRefs } from 'vue';
import { validateEmail } from "~/composable/util";

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
        },
        formSubmitted: {
            type: Boolean,
            default: false
        },
        value: {
            type: String,
            default: '',
        }
    })

    const { type, name, placeHolder, autoFocus, showLabel, labelName, optional, formSubmitted, value} = toRefs(props)

    const emits = defineEmits([
        'input',
        'valid'
    ])

    const isInputDirty = ref(false)
    const inputValue = ref(value.value)
    const errorField = showLabel?labelName.value:placeHolder.value
    const errors = ref({
        'required': `${errorField} is required`,
        'is_email': `must be email`
    })
    const isValidEmail = ref(true)

    const computedInputValue = computed<string>({     
       get() : string {
        return inputValue.value
       },
       
       set(value : string) {
        emits('valid', true)

        if(!value){
            emits('valid', false)
            isInputDirty.value = true
        }else{
            isInputDirty.value = false
        }

        if(type.value === 'email'){
            const validEmail = validateEmail(value)
            isValidEmail.value = (validEmail)?true:false
            if(validEmail){
                isValidEmail.value = true
            }else{
                isValidEmail.value = false
                emits('valid', false)
            }
        }
        inputValue.value = value;
        emits('input', value)
       }   
    })
</script>