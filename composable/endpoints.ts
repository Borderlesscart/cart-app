export const baseApi = {
    auth: {
        login: () => 'auth/login',
        register: () => 'auth/register',
        otp: () => 'auth/send-sms-otp',
        verify_otp: () => 'auth/verify-phone',
        forgot_password: () => 'auth/forgot-password',
        verify_password_reset: () => 'auth/verify-password-reset',
        update_password: () => 'auth/update-password'
    }
}