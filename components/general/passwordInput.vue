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
                 :type="hidePassword?'password':'text'" 
                 :name="name"
                 :placeholder="placeHolder"
                 :autofocus="autoFocus"
                 :id="name"
                 v-model="computedInputValue"
                >
                <span 
                v-if="hidePassword" 
                class="float-right cursor-pointer relative bottom-8 right-4"
                @click="toggleHidePassword()"
                >
                    <img :src="eyeImg">
                </span>
                <span 
                v-else
                class="float-right cursor-pointer relative bottom-8 right-4"
                @click="toggleHidePassword()"
                >
                    <img :src="crossedEyeImg">
                </span>
                <span v-if="!optional && isInputDirty" class="font-inter text-xs text-primary">{{ errors.required }}</span> &nbsp;
                <span v-if="!optional &&  isInputDirty || !isValidPassword" class="font-inter text-xs text-primary">{{ errors.password_length }}</span> &nbsp;
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, toRefs } from 'vue';
import crossedEyeImg from '~/assets/img/crossed-eye.svg'
import eyeImg from '~/assets/img/eye.svg'

    const props = defineProps({
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

    const { name, placeHolder, autoFocus, showLabel, labelName, optional} = toRefs(props)

    const hidePassword = ref(true)

    const toggleHidePassword = () => {
        hidePassword.value = !hidePassword.value
    }

    const inputValue = ref('')
    const errors = ref({
        'password_length': 'Password must be 6 characters or more',
        'required': 'field is required'
    })
    const isValidPassword = ref(true)
    const isInputDirty = ref(false)

    const emits = defineEmits([
        'input',
        'valid'
    ])

    const computedInputValue = computed<string>({     
       get() : string {
        return inputValue.value
       },
       
       set(value : string) {
        emits('valid', true)
        isInputDirty.value = false
        isValidPassword.value = true

        if(!value){
            emits('valid', false)
            
            isInputDirty.value = true
        }

        if(value.length < 6){
            emits('valid', false)        
            isValidPassword.value = false
        }

        inputValue.value = value;
        emits('input', value)
       }   
    })
</script>