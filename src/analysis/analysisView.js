
//---------------------------------
//TOP-LEVEL VIEW CONTROLS
//---------------------------------

export function initialiseAnalysisView(map) {
console.log('INITIALISE ANALYSIS VIEW STARTED');

const mapView = document.getElementById('map-view');
const analysisView = document.getElementById('quantitative-analysis');

const mapViewButton = document.getElementById('map-view-button');
const analysisViewButton = document.getElementById('analysis-view-button');
const splitViewButton = document.getElementById('split-view-button');   

console.log('mapView', mapView);
console.log('analysisView', analysisView);
console.log('mapViewButton', mapViewButton);
console.log('analysisViewButton', analysisViewButton);
console.log('splitViewButton', splitViewButton);



//---------------------------------
//MAP SHOW:ER
//---------------------------------
function showMapView() {
  
  mapView.classList.add('active');
  analysisView.classList.remove('active');

  mapViewButton.classList.add('active');
  analysisViewButton.classList.remove('active');
  splitViewButton.classList.remove('active');

  document.body.classList.remove('split-view');

  if (map) {

    setTimeout(() => map.updateSize(), 0)
    
  }
}


//---------------------------------
//QUANTITATIVE ANALYSIS SHOW:ER
//---------------------------------
function showAnalysisView() {

    mapView.classList.remove('active');
  analysisView.classList.add('active');
  //splitView.classList.remove('active');

  mapViewButton.classList.remove('active');
  analysisViewButton.classList.add('active');
  splitViewButton.classList.remove('active');

  document.body.classList.remove('split-view');

  if (map) {
    setTimeout(() => map.updateSize(), 0);
    
  }
}


//---------------------------------
//SPLIT VIEW SHOW:ER
//---------------------------------
function showSplitView() {
    
    mapView.classList.add('active');
    analysisView.classList.add('active');
    //splitView.classList.add('active');

    mapViewButton.classList.remove('active');
    analysisViewButton.classList.remove('active');
    splitViewButton.classList.add('active');

    document.body.classList.add('split-view');

    if (map) {
        setTimeout(() => map.updateSize(), 0);        
    }
}





//---------------------------------
//TOP LEVEL BUTTON EVENTS
//---------------------------------
mapViewButton.addEventListener('click', showMapView);

analysisViewButton.addEventListener('click', showAnalysisView);

splitViewButton.addEventListener('click', showSplitView);



//---------------------------------
//ANALYSIS TAB SWITCHING
//---------------------------------
const analysisTabs = document.querySelectorAll('.analysis-tab');
const analysisPanels = document.querySelectorAll('.analysis-panel');

analysisTabs.forEach(tab => {

  tab.addEventListener('click', () => {

    //Remove active state from all tabs
    analysisTabs.forEach(tabButton => {
      tabButton.classList.remove('active');
    });

    //Add active state to the clicked tab
    tab.classList.add('active');

    //Hide all analysis panels
    analysisPanels.forEach(panel => {
      panel.classList.remove('active');
    });

    //Find which analysis was selected
    const analysisName = tab.dataset.analysis;

    //Find the corresponding panel
    const selectedPanel = document.getElementById(`${analysisName}-analysis`);

    //Show the selected panel
    if (selectedPanel) {
      selectedPanel.classList.add('active');
    };
  });

});

}