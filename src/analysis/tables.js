import {burnSeverityOrder} from './constants.js';

//---------------------------------
//Format a number for display
//---------------------------------
function formatNumber(value, decimals = 2) {
    return Number(value).toLocaleString('en-GB', {minimumFractionDigits: decimals, maximumFractionDigits: decimals});
}

//--------------------------------
//Creating a generic HTML table
//---------------------------------
function createTable(headers, rows) {

    const table = document.createElement('table');

    table.className = 'analysis-table';


//-------------
    //Header
//-------------

    const tableHeader = document.createElement('thead');

    const headerRow = document.createElement('tr');

    headers.forEach(header => {

        const th = document.createElement('th');
        
        th.textContent = header;

        headerRow.appendChild(th);
    });

    tableHeader.appendChild(headerRow);

    table.appendChild(tableHeader);


    //Body

    const tableBody = document.createElement('tbody');

    rows.forEach(row => {
        const tableRow = document.createElement('tr');

        row.forEach(value => {
            const tableDivider = document.createElement('td');

            tableDivider.textContent = value;

            tableRow.appendChild(tableDivider);
        });

        tableBody.appendChild(tableRow);
    });

    table.appendChild(tableBody);
    
    return table;
}

//----------------------
//Burn severity table
//----------------------

export function renderBurnSeverityTable(data, container) {

    container.innerHTML = '';

    const rows = [];

    burnSeverityOrder.forEach(severity=> {
        
        const result = data[severity];

        rows.push([
            severity,
            `${formatNumber(result.hectares)} ha`,
            `${formatNumber(result.percentage)}%`
        ]);
    });


    //Calcualte totals

    const totalHectares = burnSeverityOrder.reduce((sum, severity) => sum + data[severity].hectares, 0);
    
    const totalPercentage = burnSeverityOrder.reduce((sum, severity) => sum + data[severity].percentage, 0);

    rows.push([
        
        'Total',

        `${formatNumber(totalHectares)} ha`,
        `${formatNumber(totalPercentage)}%`
    ]);


    const table = createTable(['Burn Severity', 'Area', 'Percentage'], rows);

    container.appendChild(table);
}



//Slope table

export function renderSlopeTable(data, container) {

    container.innerHTML = '';

    const headers = ['Slope Class', 'Area (ha)', ...burnSeverityOrder.map(severity => `${severity} (%)`)];


    const rows = data.map(row => {

        return [

            row.slopeClass,
            formatNumber(row.totalHectares),
            ...burnSeverityOrder.map(severity => formatNumber(row.severities[severity]))
        ];
    });


    const table = createTable(headers, rows);

    container.appendChild(table);
}




//Aspect table

export function renderAspectTable(data, container) {

    container.innerHTML = '';

    const headers = ['Aspect Class', 'Area (ha)', ...burnSeverityOrder.map(severity => `${severity} (%)`)];

    const rows = data.map( row => {

        return[

            row.aspectClass,
            formatNumber(row.totalHectares),
            ...burnSeverityOrder.map(severity => formatNumber(row.severities[severity]))
        ];
    });


    const table = createTable(headers, rows);

    container.appendChild(table);
}