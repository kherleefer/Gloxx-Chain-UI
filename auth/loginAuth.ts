import { ref, computed, onMounted} from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";
import { AxiosError } from 'axios';
import { PreferencesService } from '@/services/preferencesService';

interface ErrorResponse {
    message: string;
}

export function loginAuth() {
    const router = useRouter();
    const userName = ref("");
    const password = ref("");
    const rememberMe = ref(false);
    const showPassword = ref(false);
    const errorMessage = ref("");
    const toastMessage = ref("");
    const toastOpen = ref(false);
    const isLoading = ref(false);
    const isModalOpen = ref(false);

    const isFormValid = computed(() => userName.value && password.value.length >= 6);

    const togglePasswordVisibility = () => {
        showPassword.value = !showPassword.value;
    };

    const login = async () => {
        if (!isFormValid.value) return;
        
        
        try {
	    isLoading.value = true;
            console.log('Attempting login with:', { userName: userName.value });
            const response = await api.post('/login', { //login Request to api
                userName: userName.value, 
                password: password.value 
            });
            
            if (response.status === 200) {
		 /*you can use other methods like Capacitor storage plugin
		   in this example we use capacitor preferances
		 */
                 if (rememberMe.value){
                    await Promise.all([ //this is used when user checked the rememberMe box 
                        PreferencesService.set('authtoken', response.data.token),
                        PreferencesService.set('token', response.data.token),
                        PreferencesService.set('username', userName.value),
                        PreferencesService.set('userId', response.data.user.id.toString())
                    ]);
                } else {
                    await Promise.all([
                        PreferencesService.set('token', response.data.token),
                        PreferencesService.set('username', userName.value),
                        PreferencesService.set('userId', response.data.user.id.toString())
                    ]);
                }

                toastMessage.value = 'login success';
                toastOpen.value = true;
                
                // Reset app state and navigate to home
                await router.replace("/tabs/home");
            }
        } catch (error: unknown) {
            console.error('Login error:', error);
            const axiosError = error as AxiosError<ErrorResponse>; //We use axios to communicate with the api check services directory of these project
            const message = axiosError.response?.data?.message || 'Network error occurred';
            errorMessage.value = message;
            toastMessage.value = message;
            toastOpen.value = true;
        } finally {
            isLoading.value = false;
        }
    };
    /*
    const autoLogin = async () => {
        const authToken = await PreferencesService.get('authtoken');
        if (authToken) {
            await router.replace("tabs/home");
            
        };
    };
    */
    const forgotPassword = () => {
        isModalOpen.value = true;
    };

    const goToRegister = () => {
        router.push("/register");
    };
onMounted(() => {
   // autoLogin(); this has no function Check App.vue file
})
    return { 
        userName, password, rememberMe, showPassword, errorMessage, 
        goToRegister, forgotPassword, login, togglePasswordVisibility, 
        isFormValid, isLoading, isModalOpen 
    };

}
