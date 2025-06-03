<template>
    
    <ion-card class="b-all">
       
        <br>

        <ion-card-content>
        <canvas ref="chartCanvas"> </canvas>
        <div v-if="error" class="error-message">{{ error }} </div>
        </ion-card-content>      
        
        </ion-card>
</template>

<script setup lang="ts">
import { 
    IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonSelect, IonTitle,
    IonCardContent, IonProgressBar, IonButton, IonIcon,IonModal, IonSelectOption,
    IonSpinner, IonItem, IonLabel, IonInput, IonList, IonText
} from '@ionic/vue';
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { initChart, getBarChartConfig } from '@/utils/chart';
import { Chart, type ChartItem } from 'chart.js';
import api from '@/services/api';
import { isNullOrUndef } from 'chart.js/dist/helpers/helpers.core';

const chartCanvas = ref<HTMLCanvasElement | null>(null);
const chartInstance = ref<Chart | null>(null);
const error = ref<string | null>(null);
const usersThreshold = ref([]);
const coinsThreshold = ref([]);
const thresholdName = ref([]);
const totalUser = ref(0);
const totalCoin = ref(0);
//const chartData = ref({});
interface ChartData {
    labels: any[];
    values: any[];
}
//chart Data
const chartData = computed<ChartData>(() => ({
    labels: thresholdName.value,
    values: usersThreshold.value

}));

const fetchthData = async () => {
    try {
        const token = localStorage.getItem('Usertoken'); // consider switching to capacitor preferances or capacitor storage as other 


        const response = await api.get('/user-stats', {
            
        });

        usersThreshold.value = JSON.parse(JSON.stringify(response.data.usersThreshold));
        coinsThreshold.value = JSON.parse(JSON.stringify(response.data.coinsThreshold));
        thresholdName.value = JSON.parse(JSON.stringify(response.data.thresholdName));
        totalUser.value = response.data.totalUsers;
        totalCoin.value = response.data.totalCoins;
        

        usersThreshold.value = Object.values(usersThreshold.value);
        coinsThreshold.value = Object.values(coinsThreshold.value);
        thresholdName.value = Object.values(thresholdName.value);

        console.log('users threshold',  usersThreshold.value);
        console.log('coins threshold', coinsThreshold.value);
        console.log('threshold name',  thresholdName.value);
       
        console.log('chart data', Object.values(chartData.value.labels));

    } catch (error) {
        console.error(error);
        throw new Error('an error occured');
    }

    try {
        if (!chartCanvas.value) {
            throw new Error('Canvas element not found');
        }

        const config = getBarChartConfig(Object.values(thresholdName.value), Object.values(usersThreshold.value), totalUser.value, Object.values(coinsThreshold.value), totalCoin.value);
        chartInstance.value = initChart(chartCanvas.value, config);

        if (!chartInstance.value) {
            throw new Error('chart to intialise');
        }
        console.log('chart successfully mounted');
    } catch (err) {
        error.value = `Chart error: ${err instanceof Error ? err.message : String(err)}`;
        console.error('chart mounting error:', err);
    }
}


onMounted(async () => {
    fetchthData();

});

onUnmounted(() => {
    if (chartInstance.value) {
        console.log('destroyin chart instance');
        chartInstance.value.destroy();
        chartInstance.value = null;

    }
});

</script>

<style scope>
.chart-wraper {
    position: relative;
    width: 100%;
    height: 300px;

}

canvas {
    display: block;
    width: 100%;
    height: 100%;
}

.error-message {
    color: red;
    padding: 1rem;
    border: 1px solid red;
    background-color: #ffeeee;
}
</style>