<template>
      <NuxtLayout name="dashboard-layout"></NuxtLayout>
    
      <div class="mt-4 w-10/12 m-auto max-w-6xl">
        <div class="text-xs flex flex-col grow-1 mb-4">
            <div class="flex mt-2">
            <button class="text-primary cursor-pointer"
            @click="$router.go(-1)"
               >
                 Go Back
            </button>
            </div>
        </div>
    </div>

    <div class="w-10/12 mx-auto mt-12">
        <div class="font-judson text-login-offwhite text-center text-2xl fon">
            <span v-if="$route.query.mode === 'email'">Enter OTP sent to: {{ email }}</span>
            <span v-else>Enter OTP sent to: {{ phone }}</span>
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
                    <span v-else class="text-primary cursor-pointer" @click="sendOtp()">Request  <span class="text-login-offwhite">new OTP</span></span>
                </div>
                
                <div class="sm:w-96 w-full">
                        <GeneralButton
                        :name="formSubmitting?'Loading...':$route?.query?.type === 'resett_password'?'Login':'Login'" 
                        @clicked="verifyOtp(data.code)"
                        :disabled="validFormFields.length !== formFields || data.code.length < 4 || formSubmitting"
                        />
                </div>

                <div class="sm:w-96 w-full mt-4 font-inter text-sm flex justify-end ">
                    
                    <NuxtLink to="/auth/login" class="hover:button-color text-primary">
                        Login
                    </NuxtLink>
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
    const phone: any = useCookie('phone')
    const email: any = useCookie('email')

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

    onBeforeMount(() => {
        const phone: any = useCookie('phone')
        const email: any = useCookie('email')
        if(!phone.value && !email.value){
            navigateTo('/auth/login')
            return
        }
    })


    onMounted(() => {   
        const phone: any = useCookie('phone')
        const email: any = useCookie('email')
        if(phone.value){
            validFormFields.value.push(phone.value)
        } else if(email.value){
            validFormFields.value.push(email.value)
        }
        updateCountDown()
    })

    const sendOtp = async () => {
        const phone: any = useCookie('phone')
        const email: any = useCookie('email')
        if(!phone.value && !email.value){
            navigateTo('/auth/login')
            return
        }

        if(route?.query?.mode === 'email'){
            await authStore.sendOtpEmail({email: email.value})
        }else{
            await authStore.sendOtp({phone: phone.value})
        }

        countDown.value = 60
        updateCountDown()
    }

    const verifyOtp = async (code: string) => {
        const phone: any = useCookie('phone')
        const email: any = useCookie('email')
        if(!phone.value && !email.value){
            navigateTo('/auth/login')
            return
        }

        try{
            let data = {
                phone: phone.value, 
                code: parseInt(code) //covert to number
            }

            formSubmitting.value = true

            if(route?.query?.type === 'reset_password' && route?.query?.mode !== 'email'){
                // phone password reset
                await authStore.verifyPasswordReset(data)
            }else if(route?.query?.mode === 'email'){
                // email password reset
                const data = {
                    code: parseInt(code), //covert to number
                    email: email.value
                }
                await authStore.verifyPasswordResetEmail(data)
            }else{    
                // otp verification for phone number 
                await authStore.verifyOtp(data)    
            } 

            formSubmitting.value = false
        }catch(error){
            formSubmitting.value = false
        }
        
    }
</script>
<style>
</style>