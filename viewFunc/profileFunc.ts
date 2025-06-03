import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { PreferencesService } from '@/services/preferencesService';
import { useRouter } from 'vue-router';
import { handleAuthError } from '@/utils/authUtils';
import { loadingController } from '@ionic/vue';

export function profileFunc() {
    const router = useRouter();
    const showAlert = ref<boolean>(false);
    const showError = ref<boolean>(false);
    const errorMessage = ref<string>("");
    const error = ref<string | null>(null);
    const fullName = ref('');
    const userName = ref('');
    const country = ref('');
    const phoneNum = ref('');
    const profileImage = ref('');
    const referrals = ref(0);
    const taskes = ref(0);
    const nodes = ref(0);
    const isloading = ref<boolean>(false);

    const firstName = ref('');
    const lastName = ref('');
    const PhoneNum = ref('');
    const location = ref('');
    const image = ref(null);
    const email = ref(null);
    const password = ref(null);
    const newPassword = ref(null);
    const cPassword = ref(null);
    const oldPassword = ref(null);
    const key = ref('');
    const isEditModalOpen = ref(false);
    const isImageModalOpen = ref(false);
    const fileInput = ref<HTMLInputElement | null>(null);
    const file = ref<File | null>(null);


    const openImageModal = () => {
        isImageModalOpen.value = true;
    };

    const closeImageModal = () => {
        isImageModalOpen.value = false;
    };

    const uploadFile = () => {
        fileInput.value?.click();
       // console.log('file input', fileInput);

    };

    const handleFileChange = async (event: Event) => {
        const target = event.target as HTMLInputElement;

        if (target.files && target.files[0]) {
            file.value = target.files[0];
           // console.log('file', file);
        }
    }
    const uploadImage = async () => {

        if (!file.value) {
           // console.log('No file Selected');

            return;
        }

        try {
           // console.log('Attempting upload with', file.value.name);
            const userId = await PreferencesService.get('userId');
            const updateData = new FormData();


            updateData.append('profile', file.value!);
            updateData.append('imageType', file.value.type);
            updateData.append('userId', userId);
           // console.log('upadate profile', updateData.get('profile'), 'update user', updateData.get('userId'));
            isloading.value = true;
            const res = await api.post(`/image_update`, updateData);
            if (res.data) {

               // console.log(res.data);
                await fetchthData();
                closeImageModal();
                showAlert.value = true;


            }
        } catch (err) {
            //console.error('Upload failed:', err);
            showError.value = true;
            errorMessage.value = 'Failed to upload Image!';
        }
    }

    const removeImage = () => {
        profileImage.value = 'https://ionicframework.com/docs/img/demos/avatar.svg';
        closeImageModal();
    };

    const fetchthData = async () => {
        const loading = await loadingController.create({
            message: 'Please Wait...',
            spinner: 'dots'
        })
        await loading.present();
        try {
            const userId = await PreferencesService.get('userId');
            if (!userId) {
                throw new Error('User ID not found. Please log in again.');
            }
            const response = await api.post('/profile', {
                userId: parseInt(userId)
            });
            firstName.value = response.data.fName;
            lastName.value = response.data.lName;
            fullName.value = firstName.value + ' ' + lastName.value;
            userName.value = response.data.userName;
            country.value = response.data.country;
            phoneNum.value = response.data.phoneNum;
            profileImage.value = response.data.profileImage;
            referrals.value = response.data.referrals;
            taskes.value = response.data.taskes;
            nodes.value = response.data.nodes;
            key.value = response.data.key;
            //console.log(profileImage);
        } catch (error) {
            //console.error('Error fetching profile:', error);
            await handleAuthError(error, router);

        } finally {
            await loading.dismiss();
        }
    };

    const activeEditModal = ref<string>('');
    const editValue = ref('');
    const lKey = ref('');
    const openFieldModal = (field: string, currentValue: string) => {
        activeEditModal.value = field;
        editValue.value = currentValue;
    };

    const closeFieldModal = () => {
        activeEditModal.value = '';
        editValue.value = '';
    };

    const saveFieldEdit = async () => {
        if (!editValue.value) return;

        isloading.value = true;
        try {
            const userId = await PreferencesService.get('userId');
            if (!userId) {
                await handleAuthError(new Error('User ID not found'), router);
                return;
            }
            const updateData: any = { userId };

            switch (activeEditModal.value) {
                case 'firstName':
                    updateData.firstName = editValue.value;
                    break;
                case 'lastName':
                    updateData.lastName = editValue.value;
                    break;
                case 'phone':
                    updateData.PhoneNum = editValue.value;
                    break;
                case 'location':
                    updateData.location = editValue.value;
                    break;
                case 'password':
                    if (editValue.value !== cPassword.value) {
                        throw new Error("Passwords don't match");
                    }
                    updateData.password = editValue.value;
                    updateData.key = lKey.value;
                    break;
            }
            // console.log(updateData, lKey);
            const response = await api.post('/profile_update', updateData);

            if (response.data.message.includes("successful")) {
                showAlert.value = true;
                await fetchthData();
                closeFieldModal();
            }
        } catch (error: any) {
            //console.error('Field update error:', error);
            if (error.response?.status === 401 || !await PreferencesService.get('userId')) {
                await handleAuthError(error, router);
            } else {
                //console.error('Error updating field', error.response?.data?.error || error.message)
                alert('Error updating field');
            }
        } finally {
            isloading.value = false;
        }
    };
    const alertMessage = ref<string>('');
    const copyText = async (text: string): Promise<void> => {
        try {
            await navigator.clipboard.writeText(text);
            //console.log('copied', text);
            showAlert.value = true;
            alertMessage.value = 'Username Copied';
        } catch (err) {
            //console.error('copy failed', err)
        }

    }
    onMounted(async () => {
        await fetchthData();
    });

    return {
        fullName, userName, country, phoneNum, profileImage, referrals, taskes, nodes,
        isEditModalOpen, isloading, copyText, alertMessage,
        firstName, lastName, PhoneNum, location, image, email, oldPassword, newPassword, cPassword,
        activeEditModal, editValue, openFieldModal, closeFieldModal,
        saveFieldEdit, lKey, key, isImageModalOpen, openImageModal, fileInput,
        closeImageModal, uploadImage, removeImage, handleFileChange, uploadFile, file, showAlert, showError, errorMessage
    };
}