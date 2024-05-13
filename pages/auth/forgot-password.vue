<template>
    <NuxtLayout name="public-layout"></NuxtLayout>
    <div class="w-10/12 mx-auto mt-12">
        <div class="font-judson text-login-offwhite text-center text-2xl fon">
            <span>Forgot password?</span>
        </div>

        <form>
            <div class="flex flex-col items-center mt-10">
                <div class="sm:w-96 w-full mt-6">
                    <GeneralTextInput 
                        type="text" 
                        name="user_id" 
                        place-holder="+2349023445432"
                        :auto-focus="true"
                        @input="value => data.phone = value"
                        @valid="value => validateFormInput(value, 'phone')"
                        :show-label="true"
                        label-name="phone ( +234... )"
                    />
                </div>

                <div class="sm:w-96 w-full mt-2">
                    <GeneralButton 
                        name="Change password" 
                        @clicked="forgotPassword(data)"
                        :disabled="validFormFields.length !== formFields || data.phone.length < 7"
                    />
                </div>
            </div>
        </form>
    </div>
    
</template>
<script lang="ts" setup>
import { ref } from 'vue';

    const data = ref({phone: ''})
    const formSubmitting = ref(false)
    const formFields = ref(Object.keys(data.value).length)
    const validFormFields = ref<string[]>([])
    const authStore = useAuthStore()

    const validateFormInput = (valid: boolean, formInput: string) => {
        if(valid){
            if(!validFormFields.value.includes(formInput)){
                validFormFields.value.push(formInput)
            }        
        }else{
            validFormFields.value = validFormFields.value.filter(validFormField => validFormField !== formInput)
        }
    }

    const forgotPassword = async (data: {phone: string}) => {
        await authStore.sendPasswordResetOtp(data)
    }
</script>