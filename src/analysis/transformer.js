import {burnSeverityOrder, normalizeBurnSeverity} from './constants.js';


function parseNumber(value) {
    if (value === undefined || value === null || value === '') {
        return 0;
    }
    return Number(String(value).replace(',','.'));
}





export function transformBurnSeverityData(data) {
    const burnSeverityClasses = {};

    burnSeverityOrder.forEach(severity => {
        burnSeverityClasses[severity] = {
            hectares: 0,
            percentage: 0
        };
    });

    data.forEach(row => {

        const severity = normalizeBurnSeverity(row.Severity);

        if(severity) {
            burnSeverityClasses[severity] = {
                hectares: parseNumber(row.HECTARES),
                percentage: parseNumber(row.Percentage)
            };
        }

    });

    return burnSeverityClasses;
}








//Slope transformer
export function transformSlopeData(data) {
    const slopeClasses = [];

    data.forEach(row => {
        const slopeClass = row.SlopeClass;

        if (!slopeClasses.includes(slopeClass)) {
            slopeClasses.push(slopeClass);
        }
    });

    return slopeClasses.map(slopeClass => {
        const rows = data.filter(
            row => row.SlopeClass === slopeClass
        );

        const totalHectares = rows.length > 0
            ? parseNumber(rows[0].slopecariot_total_area_SUM_HECTARES) : 0;


            //Start with all 7 severity classes
        const severities = {};

        burnSeverityOrder.forEach(severity => {
            severities[severity] = 0;
        });

        rows.forEach(row => {
            
            const severity = normalizeBurnSeverity(row.BurnSeverity);

            if (severity) {

                severities[severity] = parseNumber(row.SlopePrcnt);
            }

        });


        return {
            slopeClass,
            totalHectares,
            severities
        };

    });
}





//Aspect transformer
export function transformAspectData(data) {
    const aspectClasses = [];

    data.forEach(row => {
        const aspectClass = row.AspectClass;

        if (!aspectClasses.includes(aspectClass)) {
            aspectClasses.push(aspectClass);
        }
    });

    return aspectClasses.map(aspectClass => {
        const rows = data.filter(
            row => row.AspectClass === aspectClass
        );

        const totalHectares = rows.length > 0
        ? parseNumber(rows[0].SUM_Hectares) : 0;

        const severities = {};

        burnSeverityOrder.forEach(severity => {
            severities[severity] = 0;
        });

        rows.forEach(row => {

            const severity = normalizeBurnSeverity(row.BurnSeverity);

            if (severity) {
                severities[severity] = parseNumber(row.AspectPrcnt);
            }
        });


      return {
        aspectClass,
        totalHectares,
        severities
      };  
    });
}