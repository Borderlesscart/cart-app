export const baseApi = {
    auth: {
        login: () => 'auth/login',
        register: () => 'auth/register',
        otp: () => 'auth/send-sms-otp',
        verify_otp: () => 'auth/verify-phone',
        forgot_password: () => 'auth/forgot-password',
        verify_password_reset: () => 'auth/verify-password-reset',
        update_password: () => 'auth/update-password'
    },
    user: {
        storeBulkDeliveryItem: () => 'profile/bulk-shipped-goods',
        updateBulkDeliveryItem: () => 'profile/delivery-list',
        getDeliveryListItems: () => 'profile/delivery-list',
        uploadDeliveryItem: () => 'profile/upload-shipped-goods',
        deleteDeliveryItem: (id: any) => `profile/delivery-list/${id}`,
        deleteListItem: (id: any) => `profile/delivery-item/${id}`,
        updateDeliveryItem: () => 'profile/shipped-goods',
        updateUserProfile: () => 'profile/create',
        updateUserAddress: () => 'profile/address'
    }
}