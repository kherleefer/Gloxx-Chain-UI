import api from '@/services/api';
import { AxiosError } from 'axios';
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

interface ErrorResponse {
    message: string;
}

export function registerFunc() {
    const router = useRouter();
    //form 
    const fName = ref("");
    const lName = ref("");
    const userName = ref("");
    const password = ref("");
    const cPassword = ref("");
    const referralCode = ref("");
    const showAlert = ref<boolean>(false);
    const alertMessage = ref<string>('');
    const showPassword = ref(false);
    const showCPassword = ref(false);
    const toastMessage = ref("");
    const toastOpen = ref(false);
    const isLoading = ref(false);
    const errorMessage = ref("");
    const Code = ref<string>("");
    Code.value = "Tokenmaster";

    const isFormValid = computed(() => fName.value && lName.value && userName.value && password.value.length >= 6 && cPassword.value.length >= 6 && referralCode.value);

    const togglePasswordVisibility = () => {
        showPassword.value = !showPassword.value;
    };
    const toggleCPasswordVisibility = () => {
        showCPassword.value = !showCPassword.value;
    };
    const register = async () => {
        if (password.value !== cPassword.value) return;

        if (!isFormValid.value) return;

       
        try {
	     isLoading.value = true;
            
            console.log('Attempting registration with:', { 
                userName: userName.value, 
                Firstname: fName.value,
                Lastname: lName.value,
                Password: password.value,
                Comfim_Password: cPassword.value, 
                Referee_Code: referralCode.value
            });
            

            const response = await api.post('/register', {
                userName: userName.value,
                Firstname: fName.value,
                Lastname: lName.value,
                Password: password.value,
                Referee_Code: referralCode.value
            });

            if (response.status === 201) {
		// you can set user to route to the Dashboard if responese 201 is true by uncommenting the preferances
                // PreferencesService.setItem("authtoken", response.data.RegToken);
                // PreferencesService.setItem("username", userName.value);
                // PreferencesService.setItem("userId", response.data.user.id.toString());
                toastMessage.value = 'registration success';
                toastOpen.value = true;

                // Reset app state and navigate to home
                await router.replace("/");
            }
        } catch (error: any) {
            //console.error('Login error:', error);
            const axiosError = error as AxiosError<ErrorResponse>;
            const message = error.response.data.message || 'Network error occurred';
            errorMessage.value = message;
            toastMessage.value = message;
            toastOpen.value = true;
        } finally {
            isLoading.value = false;
        }
        // router.push("/");
    };
    const copyText = async (text: string): Promise<void> => {
        try {
            await navigator.clipboard.writeText(text);
            console.log('copied', text);
            showAlert.value = true;
            alertMessage.value = 'Referral Code Copied';
        } catch (err) {
            //console.error('copy failed', err)
        }

    }
    const goToLogin = () => {
        router.push("/");
    };


    return {
        fName, lName, userName, password,
        cPassword, referralCode, showPassword, showCPassword, register, toggleCPasswordVisibility, togglePasswordVisibility,
        errorMessage, isFormValid, goToLogin, isLoading , Code, copyText, showAlert, alertMessage
    };
}
