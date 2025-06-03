import { Router } from 'vue-router';
import { PreferencesService } from '@/services/preferencesService';

export const handleAuthError = async (error: any, router?: Router) => {
    try {
        await PreferencesService.remove('token');
        await PreferencesService.remove('userId');
        
        // Only redirect if router is provided
        if (router && router.currentRoute.value.path !== '/login') {
            await router.replace('/login');
        }
    } catch (err) {
        console.error('Error handling auth error:', err);
    }
};