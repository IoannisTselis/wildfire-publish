import Papa from 'papaparse';

export async function loadCSV(filePath) {

    console.log('Attempting to load', filePath);

    const response = await fetch(filePath);

    console.log(
        'Response',
        filePath,
        response.status,
        response.headers.get('content-type')
    );



    if (!response.ok) {
        throw new Error(`Failed to load ${filePath}`);
    }

    const csvText = await response.text();



    console.log(
        'First 200 characters of',
        filePath,
        ':',
        csvText.slice(0, 200)
    );


    
    const result = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        delimiter: ';'
    });

    if (result.errors.length > 0) {
        console.warn('CSV parsing warnings for:', filePath, result.errors); }

        console.log(
            'Parsed rows:',
            filePath,
            result.data.length
        );

        console.log(
            'First parsed row:',
            filePath,
            result.data[0]
        );
    

    return result.data;
}





export async function loadAnalysisData() {

    const [
        burnSeverity,
        slope,
        aspect
    ] = await Promise.all([
        loadCSV('./public/data/Burn_Severity_Area.csv'),
        loadCSV('./public/data/BurnSeverity_X_Slope.csv'),
        loadCSV('./public/data/BurnSeverity_X_Aspect.csv')
    ]);

    return {
        burnSeverity,
        slope,
        aspect
        
    };
}