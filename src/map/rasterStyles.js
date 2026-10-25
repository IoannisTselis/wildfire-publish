//--------------------------------------------------------------
//General ruling
//--------------------------------------------------------------

export function createRampStyle(stops, noDataValue = null) {
    const band = ['band', 1];

    const colourRamp = [
        'interpolate',
        ['linear'],
        band,
        ...stops.flatMap(stop => [stop.value, stop.color]),
    ];

    if (noDataValue !== null) {
        return {
            color: [
                'case',
                ['==', band, noDataValue],
                [0, 0, 0, 0],
                colourRamp,
            ],
        };
    }

    return {color: colourRamp};
}


//--------------------------------------------------------------
//General ruling
//--------------------------------------------------------------

export function createClassStyle(classes) {
    const band = ['band', 1];

    const cases = ['case'];

    for (const item of classes) {
        cases.push(['==', band, item.value]);
        cases.push(item.color);
    }


    cases.push([0, 0, 0, 0]);

    return {color: cases};
}


//--------------------------------------------------------------
//NDVI
//--------------------------------------------------------------
export const ndviStyle = createRampStyle([
    {value: -1.0, color: '#A60F0F'},
    {value: 0.05, color: '#DE7512'},
    {value: 0.2, color: '#F0DB0E'},
    {value: 0.4, color: '#34F00E'},
    {value: 0.6, color: '#0CC743'},
    {value: 0.8, color: '#10CAE0'},
    {value: 1.0, color: '#0891C2'},
]);

//--------------------------------------------------------------
//NBR
//--------------------------------------------------------------
export const nbrStyle = createRampStyle([
    {value: -1.0, color: '#8c510a'},
    {value: 0.0, color: '#d8b365'},
    {value: 0.2, color: '#f6e8c3'},
    {value: 0.4, color: '#c7eae5'},
    {value: 0.6, color: '#5ab4ac'},
    {value: 0.8, color: '#01665e'},
    {value: 1.0, color: '#003c30'},
]);

//--------------------------------------------------------------
//Burn severity
//--------------------------------------------------------------
export const burnSeverityStyle = createClassStyle([
    {value: 1, color: '#1CF218'},
    {value: 2, color: '#88F218'},
    {value: 3, color: '#D1F218'},
    {value: 4, color: '#EEE01B'},
    {value: 5, color: '#F0AC19'},
    {value: 6, color: '#F57614'},
    {value: 7, color: '#FF0A0E'},
]);

//--------------------------------------------------------------
//Slope
//--------------------------------------------------------------
export const slopeStyle = createClassStyle([
    {value: 1, color: '#0f6385'},
    {value: 2, color: '#358292'},
    {value: 3, color: '#88aca2'},
    {value: 4, color: '#ecd9af'},
    {value: 5, color: '#d6a379'},
    {value: 6, color: '#a77c65'},
    {value: 7, color: '#745644'},
    {value: 8, color: '#573d31'}
]);

//--------------------------------------------------------------
//Aspect
//--------------------------------------------------------------
export const aspectStyle = createClassStyle([
    {value: 2, color: '#FF0000'},
    {value: 3, color: '#FF7B00'},
    {value: 4, color: '#F6FF00'},
    {value: 5, color: '#48FF00'},
    {value: 6, color: '#00FFA6'},
    {value: 7, color: '#0099FF'},
    {value: 8, color: '#002FFF'},
    {value: 9, color: '#B300FF'}
]);