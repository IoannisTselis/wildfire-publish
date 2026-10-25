import {transformExtent} from 'ol/proj.js';


export const burnSeverityOrder = [

    'Enhanced Regrowth, High (post-fire)',
    'Enhanced Regrowth, Low (post-fire)',
    'Unburned',
    'Low Severity',
    'Moderate-Low Severity',
    'Moderate-High Severity',
    'High Severity'
];

export const burnSeverityColours = {

    'Enhanced Regrowth, High (post-fire)': '#1CF218',

    'Enhanced Regrowth, Low (post-fire)': '#88F218',

    'Unburned': '#D1F218',
    
    'Low Severity':'#EEE01B',
    
    'Moderate-Low Severity': '#F0AC19',

    'Moderate-High Severity': '#F57614',

    'High Severity': '#FF0A0E'

}

export function normalizeBurnSeverity(value) {
    if(!value) {
        return null;
    }
    
    const severity = value.trim();

    switch (severity) {

        case 'Enhanced Regrowth high (post-fire)':
        case 'Enhanced Regrowth, high (post-fire)':
        case 'Enhanced Regrowth High (post-fire)': 
        case 'Enhanced Regrowth, High (post-fire)':
        case 'Enhanced Regrowth, High':
        case 'Enhanced Regrowth High':
        case 'Enhanced Regrowth, high (post-fire':
            return 'Enhanced Regrowth, High (post-fire)';

        
        case 'Enhanced Regrowth low (post-fire)':
        case 'Enhanced Regrowth, low (post-fire)':
        case 'Enhanced Regrowth Low (post-fire)':
        case 'Enhanced Regrowth, Low (post-fire)':
        case 'Enhanced Regrowth, Low':
        case 'Enhanced Regrowth Low':
            return 'Enhanced Regrowth, Low (post-fire)';

        
        case 'Unburned':
            return 'Unburned';

        
        case 'Low Severity':
            return 'Low Severity';

        
        case 'Moderate-low Severity':
        case 'Moderate-Low Severity':
            return 'Moderate-Low Severity';


        case 'Moderate-high Severity':
        case 'Moderate-High Severity':
            return 'Moderate-High Severity';

        
        case 'High Severity':
            return 'High Severity';


        default:
            console.warn('Unrecognised burn severity', value);
            return
            
    }

};




//coordinate transformation

    const sentinelExtentUTM = [
        652680,
        4194070,
        708440,
        4227120
    ];

    export const sentinelExtent = transformExtent(
        sentinelExtentUTM,
        'EPSG:32634',
        'EPSG:3857'
    );

