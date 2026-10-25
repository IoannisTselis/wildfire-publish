import './style.css';
import 'ol/ol.css';
import 'ol-ext/dist/ol-ext.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import WebGLTileLayer from 'ol/layer/WebGLTile.js'
import GeoTIFF from 'ol/source/GeoTIFF.js'
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import Chart from 'chart.js/auto';
import {Style, Stroke, Fill} from 'ol/style';
import {loadAnalysisData} from './analysis/dataLoader.js'
import {transformBurnSeverityData, transformSlopeData, transformAspectData} from './analysis/transformer.js';
import {renderBurnSeverityTable, renderSlopeTable, renderAspectTable} from './analysis/tables.js';
import {createBurnSeverityChart, createSlopeChart, createAspectChart} from './analysis/charts.js';
import {initialiseAnalysisView} from './analysis/analysisView.js'
import {initialiseLayerControls} from './map/layerControls.js';
import {initialiseSwipeControls} from './map/swipeControlsFS.js';
import {sentinelExtent} from './analysis/constants.js';
import {ndviStyle, nbrStyle, burnSeverityStyle, slopeStyle, aspectStyle} from './map/rasterStyles.js';
import {createLegendControl} from './map/legendControls.js';


//-----------------------------------------------------------------------------------
//BASEMAP
//-----------------------------------------------------------------------------------

const osmLayer = new TileLayer({
  source: new OSM(),
  visible: true
});


//-----------------------------------------------------------------------------------
// Automation function workspace serve
//-----------------------------------------------------------------------------------

let cogLayerId = 0;

function createCOGLayer(folder, filename, visible = false, style = undefined, interpolate = true) {
  const url = `${import.meta.env.BASE_URL}data/rasters/${folder}/${filename}`;

  console.log('Loading COG:', url);

  return new WebGLTileLayer({
    className: `cog-layer-${cogLayerId++}`,
    source: new GeoTIFF({
      sources: [{url}],
      normalize: false,
      interpolate
    }),
    visible,
    style,
  });
}
//---------------------------------------------------------------------------------------------------
// INDEX RASTERS
//---------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------
//Burn Severity Analysis
//-----------------------------------------------------------------------------------

const burnSeverityLayer = createCOGLayer(
  'dNBR',
  'BurnSeverity_2018_08_cog.tif',
  true,
  burnSeverityStyle,
  false
);

//-----------------------------------------------------------------------------------
//dNBR (cont)
//-----------------------------------------------------------------------------------


const dnbrLayers = {
  '2018_08': createCOGLayer('dNBR', 'dNBR_2018_08_cog.tif'),
};


//-----------------------------------------------------------------------------------
//NDVI layers
//-----------------------------------------------------------------------------------

const ndviLayers = {
  '2018_06': createCOGLayer('NDVI', 'NDVI_2018_06_cog.tif', false, ndviStyle),
  '2018_08': createCOGLayer('NDVI', 'NDVI_2018_08_cog.tif', false, ndviStyle),
  '2018_10': createCOGLayer('NDVI', 'NDVI_2018_10_cog.tif', false, ndviStyle),
  '2019_01': createCOGLayer('NDVI', 'NDVI_2019_01_cog.tif', false, ndviStyle),
  '2019_04': createCOGLayer('NDVI', 'NDVI_2019_04_cog.tif', false, ndviStyle),
  '2019_10': createCOGLayer('NDVI', 'NDVI_2019_10_cog.tif', false, ndviStyle),
  '2020_01': createCOGLayer('NDVI', 'NDVI_2020_01_cog.tif', false, ndviStyle)
};


//-----------------------------------------------------------------------------------
//NBR layers
//-----------------------------------------------------------------------------------

const nbrLayers = {
  '2018_06': createCOGLayer('NBR', 'NBR_2018_06_cog.tif', false, nbrStyle),
  '2018_08': createCOGLayer('NBR', 'NBR_2018_08_cog.tif', false, nbrStyle),
  '2018_10': createCOGLayer('NBR', 'NBR_2018_10_cog.tif', false, nbrStyle),
  '2019_01': createCOGLayer('NBR', 'NBR_2019_01_cog.tif', false, nbrStyle),
  '2019_04': createCOGLayer('NBR', 'NBR_2019_04_cog.tif', false, nbrStyle),
  '2019_06': createCOGLayer('NBR', 'NBR_2019_06_cog.tif', false, nbrStyle),
  '2019_10': createCOGLayer('NBR', 'NBR_2019_10_cog.tif', false, nbrStyle),
  '2020_01': createCOGLayer('NBR', 'NBR_2020_01_cog.tif', false, nbrStyle)
};



//-----------------------------------------------------------------------------------
//Terrain Rasters
//-----------------------------------------------------------------------------------

const terrainLayers = {
  slopeClass: createCOGLayer('terrain', 'slope_classified_cog.tif', false, slopeStyle, false),
  //slopeContinuous: createCOGLayer('Slope_continuous'),
  aspectClass: createCOGLayer('terrain', 'Aspect_class_cog.tif', false, aspectStyle, false),
  //aspectContinuous: createCOGLayer('Aspect') 
};



//-----------------------------------------------------------------------------------
//Raster Transfomration
//-----------------------------------------------------------------------------------

const rasterLayerCollections = [
  ndviLayers,
  nbrLayers,
  dnbrLayers
];

rasterLayerCollections.forEach(collection => {
  Object.values(collection).forEach(layer => {
    layer.setExtent(sentinelExtent);
  });
});






Object.values(ndviLayers).forEach(layer => {layer.setVisible(false); });

Object.values(nbrLayers).forEach(layer => {layer.setVisible(false); });

Object.values(dnbrLayers).forEach(layer => {layer.setVisible(false); });

Object.values (terrainLayers).forEach(layer => {layer.setVisible(false); });

burnSeverityLayer.setVisible(true);









//-----------------------------------------------------------------------------------
//WFS wildfire perimeter vector
//-----------------------------------------------------------------------------------

const wildfirePerimeterSource = new VectorSource({
  url: `${import.meta.env.BASE_URL}data/vector/WildfirePerimeter.geojson`,
  format: new GeoJSON()
});



wildfirePerimeterSource.on('featuresloadend', () => {
  console.log('Wildfire perimeter loaded');
  console.log(
    'Number of features:',
    wildfirePerimeterSource.getFeatures().length
  );
});

wildfirePerimeterSource.on('featuresloaderror', (event) => {
  console.error('Wildfire perimeter failed to load:', event);
});


const wildfirePerimeterLayer = new VectorLayer({
  source: wildfirePerimeterSource,
  style: new Style({
    stroke: new Stroke({
      color: 'black',
      width: 1.2
    }),
    fill: new Fill({
      color: 'rgba(255, 0, 0, 0)'
    })
  })
});








//-----------------------------------------------------------------------------------
//Actual MAP
//-----------------------------------------------------------------------------------



const map = new Map({
  target: 'map',
  layers: [
      osmLayer,
      //Fire Effects
      burnSeverityLayer,
      ...Object.values(dnbrLayers),
      //Vegetation Layers
      ...Object.values(ndviLayers),
      ...Object.values(nbrLayers),
      //Terrain Layers
      ...Object.values(terrainLayers),
      //Perimeter data
        wildfirePerimeterLayer
  ],
    view: new View({
    center: [0, 0],
    zoom: 2
    })
  });



  //-----------------------------------------------------------------------------------
  //Zoom to WFS
  //-----------------------------------------------------------------------------------

  let perimeterZoomed = false;
  wildfirePerimeterSource.on('change', function() {
    if (
      !perimeterZoomed &&
      wildfirePerimeterSource.getState() === 'ready' &&
      wildfirePerimeterSource.getFeatures().length > 0
    ) {
      const extent = wildfirePerimeterSource.getExtent();
      map.getView().fit(extent, {
        padding: [50, 50, 50, 50],
        maxZoom: 11,
        //duration: 800
      });
      perimeterZoomed = true;      
    }
  });








const legendUI = createLegendControl();
map.addControl(legendUI.control);

const updateLegendForLayers = (key) => {
  legendUI.showLegend(key);
};

legendUI.showLegend('burnSeverity');


initialiseLayerControls({
    ndviLayers,
    nbrLayers,
    dnbrLayers,
    burnSeverityLayer,
    terrainLayers,
    onActiveLayerChange: updateLegendForLayers
});



//--------------------------------
// OLD SWIPE CONTROLS
//--------------------------------
initialiseSwipeControls({
    map,
    ndviLayers,
    nbrLayers,
    dnbrLayers,
    burnSeverityLayer,
    terrainLayers
});










//Potentially remove all console commands for release version

//Function for pulling stuff from other JS files
async function initialiseAnalysis() {

  console.log('1. InitialiseAnalysis Started');
  
  try {

    //temporary
    console.log('2. ABOUT TO LOAD ANALYSIS DATA');

    const analysisData = await loadAnalysisData();

    //temporary
    console.log('3. LOAD ANALYSIS DATA FINISHED');

    //temporary
    console.log('4. analysisData', analysisData);

    //temporary
    console.log('5. ABOUT TO ACCESS SLOPE ROW');
    console.log('FIRST SLOPE ROW:', analysisData.slope[0]);

    //temporary
    console.log('6. ABOUT TO ACCESS ASPECT ROW');
    console.log('FIRST ASPECT ROW', analysisData.aspect[0]);

    //temporary
    console.log('7. ABOUT TO LOG ANALYSIS DATA');
    console.log('Analysis data loaded', analysisData);

    //temporary
    console.log('8. ABOUT TO COUNT BURN SEVERITY');
    console.log( 'Burn severity rows',
      analysisData.burnSeverity.length
    );

    //temporary
    console.log('9.ABOUT TO COUNT ASPECT');
    console.log( 'Aspect rows',
      analysisData.aspect.length
    );

    //temporary
    console.log('10. ABOUT TO COUNT SLOPE');
    console.log( 'Slope rows',
      analysisData.slope.length
    );






    console.log('11. ABOUT TO TRANSFORM ASPECT DATA');
    const aspectData = transformAspectData(analysisData.aspect);

    console.log('12. FINISHED TRANSFORMING ASPECT DATA');

    console.log('Transformed aspect data:', aspectData);

    console.table(aspectData);



    console.log('--- ASPECT PERCENTAGE CHECK ---');
    aspectData.forEach(row=> {
      const totalPercentage = Object.values(row.severities).reduce((sum, value) => sum + value, 0);
      console.log(row.aspectClass, '=>', totalPercentage);
    });









    console.log('13. ABOUT TO TRANSFORM SLOPE DATA');
    const slopeData = transformSlopeData(analysisData.slope);

    console.log('14. FINISHED TRANSFORMING SLOPE DATA');

    console.log('Transformed slope data:', slopeData);

    console.table(slopeData);

    console.log('FIRST SLOPE SEVERITIES:', slopeData[0].severities)
    console.log('FIRST ASPECT SEVERITIES:', aspectData[0].severities)

        console.log('--- SLOPE PERCENTAGE CHECK ---');
    slopeData.forEach(row=> {
      const totalPercentage = Object.values(row.severities).reduce((sum, value) => sum + value, 0);
      console.log(row.slopeClass, '=>', totalPercentage);
    });





    console.log('SLOPE SEVERITY NAMES:', [...new Set(analysisData.slope.map(row => row.BurnSeverity))]);



    console.log('15. INITIALISE ANALYSIS FINISHED');

    //-------------------
    //Transformation data
    //-------------------
    const burnSeverityData = transformBurnSeverityData(analysisData.burnSeverity);




    //-------------------
    //Tables
    //-------------------
    renderBurnSeverityTable(burnSeverityData, document.getElementById('burn-severity-table'));

    renderSlopeTable(slopeData, document.getElementById('slope-table'));

    renderAspectTable(aspectData, document.getElementById('aspect-table'));


    //-------------------
    //Charts
    //-------------------
    createBurnSeverityChart(burnSeverityData, document.getElementById('burn-severity-canvas'));

    createSlopeChart(slopeData, document.getElementById('slope-canvas'));

    createAspectChart(aspectData, document.getElementById('aspect-canvas'));

    console.log('Quantitative analysis initialised');
  } 

  catch (error) {
    console.error('FAILED INSIDE initialiseAnalysis',
      error
    );

  }
}

initialiseAnalysis();

initialiseAnalysisView(map);
