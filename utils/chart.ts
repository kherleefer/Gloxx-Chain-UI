import {Chart, type ChartItem, type ChartConfiguration, registerables} from 'chart.js';
import api from "@/services/api";


//intialized chart.js once
Chart.register(...registerables);

export function initChart(canvas: HTMLCanvasElement |null, config: ChartConfiguration): Chart | null {
    if (!canvas) {
        //console.log('Canvas element is null');
        return null;
    };

    try {
        //testing canvas functionality
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            //console.log('could not get 2d Context');
            return null;
        }
         
        ctx.fillStyle = '#ff000020';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //console.log('canvas drawn successful');

        //create andreturing of chart instance
        return new Chart(canvas as ChartItem, config);
    } catch (error) {
        //console.error('Chart intiallisation Failed', error);
        return null;
    }

}

//sample configuration generator
export function getBarChartConfig(labels: string[], data1: number[], userProgress: number, data2: number[], coinProgress: number): ChartConfiguration<'bar'>{
    return {
        type: 'bar',
        data: {
            labels,
            datasets: [
            {
                
                label: 'user prgress',
                data: data1.map((value ) => Math.min( value, userProgress)),
                backgroundColor: 'blue',
                stack: 'Stack 0'
            },
            {
                label: 'users Halve',
                data: data1.map((value ) => Math.max(0, value - userProgress)),
                backgroundColor: 'green',
                 
                stack: 'Stack 0' 
            },
            {
                label: 'coin prgress',
                data: data2.map((value ) => Math.min( value, coinProgress)),
                backgroundColor: 'blue',
                stack: 'Stack 1'

            },
            {
                
                label: 'coins Halve',
                data: data2.map((value ) => Math.max(0, value - coinProgress)),
                backgroundColor: 'maroon',
                 
                stack: 'Stack 1'
            },
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    
                },

                x: {
                    beginAtZero: true
                }
            }
        }
    };
}