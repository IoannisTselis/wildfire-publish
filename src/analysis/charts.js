import {Chart} from 'chart.js/auto';
import {burnSeverityOrder, burnSeverityColours} from './constants.js';

function formatLabel(label) {

    return label;
    
}

//Burn severity chart
export function createBurnSeverityChart(
    data,
    canvas
) {
    const labels = burnSeverityOrder;

    const values = burnSeverityOrder.map(severity => data[severity].percentage);

    return new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Area (%)',
                data: values,

                backgroundColor: burnSeverityOrder.map(
                    severity => burnSeverityColours[severity]
                ),

                borderColor: burnSeverityOrder.map(
                    severity => burnSeverityColours[severity]
                ),

                borderWidth: 1
            }]
        },

        options: {
            
            responsive: true,
            
            maintainAspectRatio: false,

            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Area (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Burn Severity'
                    }
                }
            }

        }
    });
}



//Burn severity x slope

export function createSlopeChart(
    data,
    canvas
) {
    const labels = data.map(row => row.slopeClass);

    const datasets = burnSeverityOrder.map(severity => ({
        
        label: severity,

        data: data.map(row => row.severities[severity]),

        backgroundColor: burnSeverityColours[severity],

        borderColor: burnSeverityColours[severity],

        borderWidth: 1
    }));

    return new Chart(canvas, {
        
        type: 'bar',

        data: {
            labels,
            datasets
        },

        options: {
            responsive: true,

            maintainAspectRatio: false,

            scales: {
                x:{
                    stacked: true,

                    title: {
                        display: true,
                        text: 'Slope Class'
                    }
                },

                y: {
                    stacked: true,
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Area (%)'
                    }
                }
            }
        }


    });
}


//Burn severity x aspect

export function createAspectChart(
    data,
    canvas
) {
    const labels = data.map(row => row.aspectClass);

    const datasets = burnSeverityOrder.map(severity => ({
        
        label: severity,

        data: data.map(row => row.severities[severity]),

        backgroundColor: burnSeverityColours[severity],

        borderColor: burnSeverityColours[severity],

        borderWidth: 1
    }));

    return new Chart(canvas, {

        type: 'bar',
        
        data: {
            labels,
            datasets
        },

        options: {
            responsive: true,
            
            maintainAspectRatio: false,

            scales: {
                x:{
                    stacked: true,

                    title: {
                        display: true,
                        text: 'Aspect'
                    }
                },

                y: {
                    stacked: true,
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Area (%)'
                    }
                }
            }
        }
    });
}
