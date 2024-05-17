<template>
    <NuxtLayout name="public-layout"></NuxtLayout>

    <div class="w-10/12 mx-auto mt-12">
        <div class="font-judson text-login-offwhite text-center text-2xl fon">
            <span>Welcome back 👋🏾</span>
        </div>

        <!-- <div class="border-b border-dark-grey mt-8 sm:w-96 w-full mx-auto"></div> -->
        <!-- Form input -->
        <form>
            <div class="flex flex-col items-center mt-10">
                <div class="sm:w-96 w-full">
                    <GeneralTextInput 
                    type="text" 
                    name="user_id" 
                    place-holder="email"
                    label-name="email"
                    :auto-focus="true"
                    :value="data.user_id"
                    @input="value => data.user_id = value"
                    @valid="value => validateFormInput(value, 'user_id')"
                    />
                </div>

                <div class="sm:w-96 w-full mt-2">
                    <GeneralPasswordInput
                    name="password" 
                    place-holder="password" 
                    label-name="password"
                    @input="value => data.password = value"
                    @valid="value => validateFormInput(value, 'password')"
                />
                </div>

                <div class="sm:w-96 w-full mt-6 font-inter text-xs flex justify-between text-login-grey">
                    <div>
                        <!-- <input
                        type="checkbox"
                        name="remember"
                        id="remember"
                        class="mr-2 cursor-pointer bg-dark"
                        >
                        <label for="remember">Remember Me</label> -->
                    </div>
                    
                    <NuxtLink to="/auth/forgot-password" class="hover:text-input-placeholder">
                        Forgot Password?
                    </NuxtLink>
                </div>
                <div class="sm:w-96 w-full mt-6">
                    <GeneralButton 
                        :name="formSubmitting?'Loading...':'Login'" 
                        @clicked="loginUser(data)"
                        :disabled="validFormFields.length !== formFields || formSubmitting"
                    />
                </div>

                <div class="sm:w-96 w-full mt-4 font-inter text-sm flex justify-between ">
                    <div class="text-input-placeholder">
                    <span>Don't have an account yet?</span>
                    </div>
                    
                    <NuxtLink to="/auth/register" class="hover:button-color text-primary">
                        Sign Up
                    </NuxtLink>
                </div>           
            </div>
        </form>
    </div>

</template>

<style scoped>
    input:-internal-autofill-selected {
        background-color: #1E1E1E !important;
    }
    
</style>

<script lang="ts" setup>
    import { ref } from 'vue';
    // setup Data
    const data = ref({user_id: '', password: ''})
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

    const authStore = useAuthStore()
    const loginUser = async (data: any) => {
        try {
            formSubmitting.value = true
            await authStore.login(data) 
            formSubmitting.value = false
        } catch (error) {
            formSubmitting.value = false
        }
       
    }

    onBeforeMount(() => {
        const user_id = localStorage.getItem('user_id')
        if(user_id){
            data.value.user_id = user_id
        }
    })
</script>