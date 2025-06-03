import { ref, computed, onMounted, onUnmounted } from "vue";
import api, { subscribeToUpdates, unsubscribeFromUpdates } from "@/services/api";
import { PreferencesService } from '@/services/preferencesService';
import { useRouter } from 'vue-router';
import { handleAuthError } from '@/utils/authUtils';
import { AdMob, AdOptions } from '@capacitor-community/admob';
import { loadingController } from '@ionic/vue';


export function homeFunc() {
    const router = useRouter();


    let progressInterval: ReturnType<typeof setInterval>;
    let balanceInterval: ReturnType<typeof setInterval>;
    let dataInterval: ReturnType<typeof setInterval>;

    const miningPower = ref('0.0000');
    const progress = ref(0);
    const stakedAmount = ref('0');
    const balance = ref('0');
    const referrals = ref<ReferralUser[]>([]);
    const sessionBal = ref(0);
    const startTime = ref(Date.now());
    const isSessionComplete = ref(false);
    const currentUser = ref<User | null>(null);
    const miningDetails = ref<MiningPowerDetails>({
        mining_power: 0,
        base_power: 0,
        stake_bonus: 0,
        referral_bonus: 0
    });
    const isLoading = ref(false);
    const isClaiming = ref(false);
    const stakeAmount = ref('');
    const isStaking = ref(false);
    const activeStakes = ref<StakeRecord[]>([]);

    const showUnstakeModal = ref(false);
    const unstakeAmount = ref('');
    const isUnstaking = ref(false);

    const showWithdrawModal = ref(false);

    const openWithdrawModal = () => {
        showWithdrawModal.value = true;
    };

    const canUnstake = computed(() => {
        const amount = parseFloat(unstakeAmount.value);
        return amount > 0 && amount <= parseFloat(stakedAmount.value);
    });

    const openUnstakeModal = () => {
        showUnstakeModal.value = true;
        unstakeAmount.value = '';
    };

    const handleUnstakeAmount = async () => {
        if (!canUnstake.value || !currentUser.value?.user_id) return;

        isUnstaking.value = true;
        try {
            const token = localStorage.getItem('token');
            const response = await api.post('/unstake', {
                userId: currentUser.value.user_id,
                amount: parseFloat(unstakeAmount.value)
            }, {
                
            });

            if (response.data.message === "Unstake successful") {
                balance.value = (parseFloat(balance.value) + parseFloat(unstakeAmount.value)).toString();
                stakedAmount.value = (parseFloat(stakedAmount.value) - parseFloat(unstakeAmount.value)).toString();

                await updateData();
                showUnstakeModal.value = false;
            }
        } catch (error: any) {
            //console.error('Unstaking error:', error);
            alert(error.response?.data?.error || 'Error while unstaking');
        } finally {
            isUnstaking.value = false;
        }
    };

    const formattedMiningPower = computed(() => {
        const mp = miningDetails.value?.mining_power ?? 0;
        const bp = miningDetails.value?.base_power ?? 0;
        const sb = miningDetails.value?.stake_bonus ?? 0;
        const rb = miningDetails.value?.referral_bonus ?? 0;

        return {
            total: mp.toFixed(8),
            base: bp.toFixed(4),
            stakeBonus: sb.toFixed(4),
            referralBonus: rb.toFixed(4),
            stakeBonusValue: sb,
            referralBonusValue: rb
        };
    });

    const stakeDuration = ref<number | ''>('');

    const canStake = computed(() => {
        const amount = parseFloat(stakeAmount.value) || 0;
        const currentBalance = parseFloat(balance.value) || 0;
        const duration = typeof stakeDuration.value === 'number' ? stakeDuration.value : 0;

        return amount > 0 &&
            amount <= currentBalance &&
            duration > 0;
    });

    const fetchUserData = async () => {
        const loading = await loadingController.create({
            message: 'Please Wait...',
            spinner: 'dots'
        })
        await loading.present();


        try {
           
            const token = await PreferencesService.get('token');
            const userId = await PreferencesService.get('userId');
            const username = await PreferencesService.get('username');
           // console.log('token', token, 'username', username, 'userId', await PreferencesService.get('userId'));

            if (!token || !username) {
                console.warn('Token or username missing on first try. Retrying...');

                await new Promise(res => setTimeout(res, 200));
                const retryToken = await PreferencesService.get('token');
                const retryUsername = await PreferencesService.get('username');

                if (!retryToken || !retryUsername) {
                    //console.error('Still missing after retry. Logging out...');
                    await handleAuthError(new Error('Missing auth data'), router);
                    return;
                }
            }
            const response = await api.get('/users');

            const userData = response.data.user.find((u: User) => u.username === username);

            if (userData) {
                currentUser.value = userData;
                balance.value = parseFloat(userData.testnet_bal.toString()).toFixed(5);

                try {
                    const miningResponse = await api.get(`/mining-sessions/${userData.user_id}`);
                    if (miningResponse.data) {
                        miningDetails.value = miningResponse.data;
                        miningPower.value =
                            parseFloat(miningResponse.data.mining_power.toString()).toFixed(5);
                    }
                } catch (error) {
                    //console.error('Error fetching mining data:', error);
                    miningPower.value = '0.0000';

                }

                try {
                    const stakingResponse = await api.get(`/staking/${userData.user_id}`);
                    if (stakingResponse.data) {
                        stakedAmount.value =
                            parseFloat(stakingResponse.data.total?.toString()).toFixed(5) || '0';
                    }

                    if (stakingResponse.data && Array.isArray(stakingResponse.data)) {
                        activeStakes.value = stakingResponse.data;
                    }

                } catch (error) {
                    //console.error('Error fetching staking data:', error);
                    stakedAmount.value = '0';
                    activeStakes.value = [];
                }



                if (userData.referrals_id) {
                    const referralIds = JSON.parse(userData.referrals_id);
                    const referralUsers = response.data.user.filter((u: User) =>
                        referralIds.includes(u.user_id)
                    ).slice(0, 3);

                    referrals.value = referralUsers.map((ref: User) => ({
                        id: ref.user_id,
                        name: `${ref.f_name} ${ref.l_name}`,
                        amount: ref.testnet_bal,
                        avatar: ref.user_img || `https://i.pravatar.cc/100?${ref.user_id}`
                    }));
                }
            }
        } catch (error) {
            //console.error('Error fetching user data:', error);
        } finally {
            await loading.dismiss();
        }
    };

    const updateSessionBalance = () => {
        if (!isSessionComplete.value) {
            const currentTime = Date.now();
            const elapsedSeconds = Math.max(0, Math.floor((currentTime - startTime.value) / 1000));
            const hourlyRate = parseFloat(miningPower.value || '0');
            const secondRate = hourlyRate / 3600;
            sessionBal.value = parseFloat((elapsedSeconds * secondRate).toFixed(8));
        }
    };

    const fetchMiningSession = async () => {
        try {
            const userId = await PreferencesService.get('userId');
            const response = await api.get(`/mining-sessions/${userId}`);
            const session = response.data;

            if (session) {
                startTime.value = (session.start_timestamp * 1000) || Date.now();
                progress.value = session.progress || 0;
                sessionBal.value = session.accumulated_rewards || 0;
                isSessionComplete.value = Boolean(session.is_complete);
                miningPower.value = (session.mining_power || 0).toString();
                miningDetails.value = {
                    mining_power: session.mining_power || 0,
                    base_power: session.base_power || 0,
                    stake_bonus: session.stake_bonus || 0,
                    referral_bonus: 0
                };
            }

            saveSession();
        } catch (error) {
            //console.error('Error fetching mining session:', error);
            initializeSession();
        }
    };

    const initializeSession = async () => {
        const savedSession = await PreferencesService.get('miningSession');

        if (savedSession) {
            const session: MiningSession = JSON.parse(savedSession);
            startTime.value = session.startTimestamp * 1000;
            progress.value = session.progress;
            sessionBal.value = session.sessionBal;
            isSessionComplete.value = session.isComplete;
        }
    };

    const saveSession = () => {
        const session: MiningSession = {
            startTimestamp: Math.floor(startTime.value / 1000),
            progress: progress.value,
            sessionBal: sessionBal.value,
            isComplete: isSessionComplete.value,
            lastUpdate: Date.now()
        };
        PreferencesService.set('miningSession', JSON.stringify(session));

    };

    const calculateProgress = () => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime.value;
        const dayInMs = 24 * 60 * 60 * 1000;
        return Math.min(Math.max(0, elapsedTime / dayInMs), 1);
    };

    const updateMiningProgress = () => {
        if (!isSessionComplete.value) {
            progress.value = calculateProgress();
            if (progress.value >= 1) {
                progress.value = 1;
                isSessionComplete.value = true;
            }
            saveSession();
        }
    };

    const startProgressInterval = () => {
        return setInterval(() => {
            if (!isSessionComplete.value) {
                const elapsed = (Date.now() - startTime.value) / (24 * 60 * 60 * 1000);
                progress.value = Math.min(elapsed, 1);

                if (progress.value >= 1) {
                    progress.value = 1;
                    isSessionComplete.value = true;
                }
                saveSession();
            }
        }, 60000);
    };

    const resetSession = () => {
        startTime.value = Date.now();
        progress.value = 0;
        sessionBal.value = 0;
        isSessionComplete.value = false;
        saveSession();
    };

    const claimMiningReward = async () => {
        if (isSessionComplete.value && parseFloat(sessionBal.value.toString()) > 0) {

            isClaiming.value = true;
            try {

                const showinterstitialAd = async () => {
                    const options: AdOptions = {
                        adId: 'ca-app-pub-6002764119448155/5923327782',
                        isTesting: false

                    }
                    await AdMob.prepareInterstitial(options);

                    await AdMob.showInterstitial();

                };
                await showinterstitialAd();
                await api.post('/claim-mining', {
                    userId: currentUser.value?.user_id,
                    amount: sessionBal.value
                });

                balance.value = (parseFloat(balance.value) + sessionBal.value).toString();
                resetSession();

            } catch (error) {
                //console.error('Error claiming reward:', error);
            } finally {
                await fetchUserData();
                await AdMob.hideBanner();
                isClaiming.value = false;
            }
        }
    };

    const formatRemainingTime = () => {
        if (isSessionComplete.value) return 'Claim Rewards';
        const remainingHours = ((1 - progress.value) * 24);
        if (isNaN(remainingHours) || remainingHours < 0) return 'Calculating...';
        return `Complete in ${remainingHours.toFixed(1)}h`;
    };

    const updateMiningPower = async () => {
        try {
            if (!currentUser.value?.user_id) return;

            const response = await api.get(`/mining-sessions/${currentUser.value.user_id}`);
            if (response.data) {
                miningDetails.value = response.data;
                miningPower.value = response.data.mining_power.toString();
                sessionBal.value = response.data.accumulated_rewards || 0;
            }
        } catch (error) {
            //console.error('Error updating mining power:', error);
        }
    };

    const updateData = async () => {
        await Promise.all([
            fetchUserData(),
            fetchMiningSession()
        ]);
    };

    const handleStake = async () => {
        if (!canStake.value || !currentUser.value?.user_id) return;

        isStaking.value = true;
        try {
            const response = await api.post('/stake', {
                userId: currentUser.value.user_id,
                amount: parseFloat(stakeAmount.value),
                duration: stakeDuration.value
            });

            if (response.data.message.includes("successful")) {
                await updateData();
                stakeAmount.value = '';
                stakeDuration.value = '';
            }
        } catch (error: any) {
            //console.error('Staking error:', error);
            alert(error.response?.data?.error || 'Error while staking');
        } finally {
            isStaking.value = false;
        }
    };

    const handleUnstake = async (stakeId: number) => {
        try {
            await api.post('/unstake', {
                userId: currentUser.value?.user_id,
                stakeId
            });
            await updateData();
        } catch (error) {
            //console.error('Unstaking error:', error);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString();
    };

    const balanceUpdateCallback = () => fetchUserData();

    onMounted(() => {
        initializeSession();
        updateData();
        subscribeToUpdates('mining', updateMiningPower);
        subscribeToUpdates('balance', balanceUpdateCallback);

        progressInterval = setInterval(updateMiningProgress, 60000);
        balanceInterval = setInterval(updateSessionBalance, 1000);
        dataInterval = setInterval(updateData, 60000);
    });

    onUnmounted(() => {
        clearInterval(progressInterval);
        clearInterval(balanceInterval);
        clearInterval(dataInterval);
        unsubscribeFromUpdates('mining', updateMiningPower);
        unsubscribeFromUpdates('balance', balanceUpdateCallback);
        saveSession();
    });
    return {
        miningPower, progress, stakedAmount, balance, referrals, sessionBal,
        startTime, isSessionComplete, updateSessionBalance, claimMiningReward,
        formattedMiningPower, isLoading, stakeAmount, isStaking, activeStakes,
        canStake, handleStake, handleUnstake, formatDate,isClaiming,
        formatRemainingTime, showUnstakeModal, unstakeAmount, canUnstake, isUnstaking,
        openUnstakeModal, handleUnstakeAmount, showWithdrawModal,
        openWithdrawModal, stakeDuration, updateData
    };
}