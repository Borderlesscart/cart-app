<template>
    <NuxtLayout name="public-layout"></NuxtLayout>
    <div class="w-10/12 mx-auto mt-12">
        <div class="font-judson text-login-offwhite text-center text-2xl fon">
            <span>Enter your new password</span>
        </div>

        <form>
            <div class="flex flex-col items-center mt-10">
                <div class="sm:w-96 w-full mt-6">
                        <GeneralPasswordInput
                            name="password" 
                            place-holder="new password" 
                            label-name="password"
                            :show-label="true"
                            @input="value => data.password = value"
                            @valid="value => validateFormInput(value, 'password')"
                        />
                </div>

                <div class="sm:w-96 w-full mt-2">
                        <GeneralPasswordInput
                            name="confirm_password" 
                            place-holder="confirm new password" 
                            label-name="confirm password"
                            :show-label="true"
                            @input="value => data.confirm_password = value"
                            @valid="value => validateFormInput(value, 'confirm_password')"
                        />
                </div>

                <div class="sm:w-96 w-full mt-6">
                        <GeneralButton 
                        v-on:clicked=""
                        :name="formSubmitting?'Loading...':'Update Password'" 
                        @clicked="updatePassword(data)"
                        :disabled="validFormFields.length !== formFields || data.password !== data.confirm_password || formSubmitting"
                        />
                </div>
            </div>
        </form>
    </div>
</template>
<script lang="ts" setup>
    import { ref, onBeforeMount } from 'vue';

    const data = ref({password: '', confirm_password: ''})
    const formSubmitting = ref(false)
    const formFields = ref(Object.keys(data.value).length)
    const validFormFields = ref<string[]>([])

    const authStore = useAuthStore()

    onBeforeMount(() => {
      const jwtToken = useCookie('jwtToken')
      const user = useCookie('user')
    //   console.log(jwtToken.value, user.value)
      if(!jwtToken.value || !user.value){
        navigateTo('/auth/login')
      }
    })

    const validateFormInput = (valid: boolean, formInput: string) => {
        if(valid){
            if(!validFormFields.value.includes(formInput)){
                validFormFields.value.push(formInput)
            }        
        }else{
            validFormFields.value = validFormFields.value.filter(validFormField => validFormField !== formInput)
        }
    }

    const updatePassword = async (data: {password: string, confirm_password: string}) => {
        try {
            formSubmitting.value = true
            const request = await authStore.updatePassword(data)
            formSubmitting.value = false
        } catch (error) {
            formSubmitting.value = false
        }
        
    }
</script>