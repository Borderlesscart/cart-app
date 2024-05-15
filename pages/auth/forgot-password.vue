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
                        place-holder="+23490... OR john@gm.."
                        :auto-focus="true"
                        @input="value => data.user_id = value"
                        @valid="value => validateFormInput(value, 'user_id')"
                        :show-label="true"
                        label-name="email OR phone ( +234... )"
                    />
                </div>

                <div class="sm:w-96 w-full mt-2">
                    <GeneralButton 
                        :name="formSubmitting?'...':'continue'" 
                        @clicked="forgotPassword(data)"
                        :disabled="validFormFields.length !== formFields || data.user_id.length < 7 || formSubmitting"
                    />
                </div>
            </div>
        </form>
    </div>
    
</template>
<script lang="ts" setup>
    import { ref } from 'vue';
    import { validateEmail, validatePhone } from "~/composable/util";

    const data = ref({user_id: ''})
    const formSubmitting = ref(false)
    const formFields = ref(Object.keys(data.value).length)
    const validFormFields = ref<string[]>([])
   

    const validateFormInput = (valid: boolean, formInput: string) => {
        if(valid){
            if(!validFormFields.value.includes(formInput)){
                validFormFields.value.push(formInput)
            }        
        }else{
            validFormFields.value = validFormFields.value.filter(validFormField => validFormField !== formInput)
        }
    }

    const forgotPassword = async (data: {user_id: string}) => {
        try{
            formSubmitting.value = true
            const authStore = useAuthStore()
            const useNotification = useNotificationStore()
            
            // check if its an email or a phone number and call the right endpoint
            if (validateEmail(data.user_id)) {  
                await authStore.sendPasswordResetOtpEmail({email: data.user_id})
            } else if (validatePhone(data.user_id)){
                await authStore.sendPasswordResetOtp({phone: data.user_id})
            } else {
                useNotification.updateError('Enter a valid email or phone number with country code e.g +2349...', false)
            }

            formSubmitting.value = false
        }catch(e){
            formSubmitting.value = false
        }  
    }
</script>