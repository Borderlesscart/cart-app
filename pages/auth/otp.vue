<template>
      <NuxtLayout name="public-layout"></NuxtLayout>
    <div class="w-10/12 mx-auto mt-12">
        <div class="font-judson text-login-offwhite text-center text-2xl fon">
            <span>Enter Your One time password</span>
        </div>

        <div class="flex flex-col items-center mt-10">
            <form>
                <div class="sm:w-96 w-full mt-6">
                        <GeneralTextInput
                        name="otp" 
                        place-holder="Enter otp to reset password" 
                        label-name="One time password"
                        :show-label="true"
                        :auto-focus="true"
                        @input="value => data.code = value"
                        @valid="value => validateFormInput(value, 'code')"
                    />
                </div>
                <div class="sm:w-96 w-full font-inter text-xs mb-2">
                    <span v-if="countDown > 0" class="text-login-offwhite">You can request a new one in <span class="text-primary">{{ countDown }}</span> secs</span>
                    <span v-else class="text-primary cursor-pointer" @click="sendOtp()">Request  <span class="text-login-offwhite">new One Time Password</span></span>
                </div>
                
                <div class="sm:w-96 w-full">
                        <GeneralButton
                        :name="formSubmitting?'Loading...':$route?.query?.type === 'resett_password'?'Login':'Login'" 
                        @clicked="verifyOtp(data.code)"
                        :disabled="validFormFields.length !== formFields || data.code.length < 6 || formSubmitting"
                        />
                </div>
            </form>
         </div>
    </div>
</template>
<script setup lang="ts">
    import { ref, onMounted } from 'vue';

    const data = ref({phone: '', code: ''})
    const formSubmitting = ref(false)
    const formFields = ref(Object.keys(data.value).length)
    const validFormFields = ref<string[]>([])
    const authStore = useAuthStore()
    const countDown = ref(60)

    const route = useRoute()
    const phone = useCookie('phone')

    const updateCountDown = () => {
        if(countDown.value > 0){
            setTimeout(() => {
                countDown.value -= 1
                updateCountDown()
            }, 1000)
        }
    }

    const validateFormInput = (valid: boolean, formInput: string) => {
        if(valid){
            if(!validFormFields.value.includes(formInput)){
                validFormFields.value.push(formInput)
            }        
        }else{
            validFormFields.value = validFormFields.value.filter(validFormField => validFormField !== formInput)
        }
    }

    const init = () => {
        phone.value = '+2348178018780'
        if(!phone.value){
            navigateTo('/auth/register')
            return
        }

        updateCountDown()
    }

    init()

    onMounted(() => {   
        if(phone.value){
            validFormFields.value.push(phone.value)
        } 
        updateCountDown()
    })

    const sendOtp = async () => {
        if(!phone.value){
            navigateTo('/auth/register')
            return
        }

        await authStore.sendOtp({phone: phone.value})
    }

    const verifyOtp = async (code: string) => {

        if(!phone.value){
            navigateTo('/auth/register')
            return
        }
        
        const data = {
            'phone': phone.value, 
            code: parseInt(code) //covert to number
        }

        formSubmitting.value = true
        console.log(route?.query?.type )
        if(route?.query?.type === 'reset_password'){
            await authStore.verifyPasswordReset(data)
        }else{    
            await authStore.verifyOtp(data)    
        } 
        formSubmitting.value = false
      
    }
</script>
<style>
</style>