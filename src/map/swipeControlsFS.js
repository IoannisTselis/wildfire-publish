import Swipe from 'ol-ext/control/Swipe.js';

export function initialiseSwipeControls ({
    map,
    ndviLayers,
    nbrLayers,
    burnSeverityLayer,
    terrainLayers
}) {


const layerCollections = {
  ndvi: ndviLayers,
  nbr: nbrLayers
};


const allRasterLayers = [
  ...Object.values(ndviLayers),
  ...Object.values(nbrLayers),
    ...Object.values(dnbrLayers),
  ...Object.values(terrainLayers),
  burnSeverityLayer
];



//swipe function from ol-ext
const swipe = new Swipe();

map.addControl(swipe);


//code for swipe
let swipeLeftLayer = null;
let swipeRightLayer = null;


//store the visibility of layers before starting the swipe
let visibilityBeforeSwipe = null;

//Keeps track of which group is being compared
//let activeSwipeGroup =null;


//swipe controls
const groupSelect = document.getElementById('swipeGroup');
const leftSelect = document.getElementById('swipeLeft');
const rightSelect = document.getElementById('swipeRight');
const startButton = document.getElementById('swipeStart');
const stopButton = document.getElementById('swipeStop');


//update the checkbox
function updateLayerCheckbox(groupName, date, checked) {
  
  const checkbox = document.getElementById(`${groupName}_${date}`);

  if (checkbox) {
    checkbox.checked = checked;
  }
}


function syncAllCheckboxes() {

  Object.entries(ndviLayers).forEach(([date, layer]) => {updateLayerCheckbox('ndvi', date, layer.getVisible()); });

  Object.entries(nbrLayers).forEach(([date, layer]) => {updateLayerCheckbox('nbr', date, layer.getVisible()); });




  const burnCheckbox = document.getElementById('BurnSeverityCheckbox');

  if (burnCheckbox) {
    burnCheckbox.checked = burnSeverityLayer.getVisible();
  }



  const slopeCheckbox = document.getElementById('slopeCheckbox');

  if (slopeCheckbox) {
    slopeCheckbox.checked = terrainLayers.slopeClass.getVisible();
  }



  const aspectCheckbox = document.getElementById('aspectCheckbox');

  if (aspectCheckbox) {
    aspectCheckbox.checked = terrainLayers.aspectClass.getVisible();
  }

}



//populate left/right dropdowns
function populateSwipeLayers() {
  leftSelect.replaceChildren();
  rightSelect.replaceChildren();

  const collection = layerCollections[groupSelect.value];

  if (!collection) {
    return;
  }

  Object.keys(collection).forEach(date => {

    const leftOption = document.createElement('option');

    leftOption.value = date;
    leftOption.textContent = date.replace('_', '-');


    const rightOption = document.createElement('option');

    rightOption.value = date;
    rightOption.textContent = date.replace('_', '-');

    leftSelect.appendChild(leftOption);
    rightSelect.appendChild(rightOption);

  });

  if (rightSelect.options.length > 1) {
    rightSelect.selectedIndex = 1;    
  }
}


function stopCurrentSwipe() {
  
  if (swipeLeftLayer) {
    swipe.removeLayer(swipeLeftLayer);
  }

  if (swipeRightLayer) {
    swipe.removeLayer(swipeRightLayer);
  }

  if (visibilityBeforeSwipe) {
    visibilityBeforeSwipe.forEach((wasVisible, layer) => {layer.setVisible(wasVisible); });
  }

  
  swipeLeftLayer = null;
  swipeRightLayer = null;
  visibilityBeforeSwipe = null;
  //activeSwipeGroup = null;

  syncAllCheckboxes();
}



//Change the available dates when the group changes
groupSelect.addEventListener('change', () => {
  stopCurrentSwipe();
  populateSwipeLayers();
});

populateSwipeLayers();

//Start a swipe comparison
startButton.addEventListener('click', () => {
  const groupName = groupSelect.value;
  const leftDate = leftSelect.value;
  const rightDate = rightSelect.value;

  if(leftDate === rightDate) {
    alert('Please select two different layers.');
    return;
  }


  const collection = layerCollections[groupName];

  if (!collection) {
    console.error('Unknown raster group:', groupName);
    return;  
  }

  const leftLayer = collection[leftDate];
  const rightLayer = collection[rightDate];

  if (!leftLayer || ! rightLayer) {
    console.error('Could not find the selected raaster layers.');
    return;
  }

  //If another swipe is already active, restore its original state first.
  stopCurrentSwipe();

  //Save visibility for all raster layers, not just the specific group.
  visibilityBeforeSwipe = new Map(
  allRasterLayers.map(layer => [
    layer,
    layer.getVisible()
  ])
  );

  //Hide all rasters
  allRasterLayers.forEach(layer => {
    layer.setVisible(false);
  });


  //Show only the selected layers
  leftLayer.setVisible(true);
  rightLayer.setVisible(true);

  /*
  leftLayer.setVisible(true);
  rightLayer.setVisible(false);
*/

  console.log('Left layer class:', leftLayer.getClassName());
  console.log('Right layer class:', rightLayer.getClassName());


  //Add the layers to the swipe control
  swipe.addLayer(leftLayer, false);
  swipe.addLayer(rightLayer, true);


  swipeLeftLayer = leftLayer;
  swipeRightLayer = rightLayer;
  //activeSwipeGroup = groupName;

  syncAllCheckboxes();

  console.log(`Swipe started: ${groupName}, ${leftDate} vs ${rightDate}`);
  });


  //Stop the comparison and restore previous visibility
  stopButton.addEventListener('click', () => {
    stopCurrentSwipe();
  });

  //Make sure that the controls initially match the actual layer state
  syncAllCheckboxes();

}





