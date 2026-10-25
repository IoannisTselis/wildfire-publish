export function initialiseSwipeControls ({
    swipe,
    ndviLayers,
    nbrLayers,
    dnbrLayers,
    showSwipeBox,
    hideSwipeBox
}) {

const layerCollections = {
  ndvi: ndviLayers,
  nbr: nbrLayers,
  dnbr: dnbrLayers
};

//code for swipe
let swipeLeftLayer = null;
let swipeRightLayer = null;


//store the visibility of layers before starting the swipe
let visibilityBeforeSwipe = {};

//Keeps track of which group is being compared
let activeSwipeGroup =null;


//swipe controls
const groupSelect = document.getElementById('swipeGroup');
const leftSelect = document.getElementById('swipeLeft');
const rightSelect = document.getElementById('swipeRight');

//update the checkbox
function updateLayerCheckbox(groupName, date, checked) {
  
  const checkbox = document.getElementById(`${groupName}_${date}`);

  if (checkbox) {
    checkbox.checked = checked;
  }
}

//populate left/right dropdowns
function populateSwipeLayers() {
  leftSelect.innerHTML = '';
  rightSelect.innerHTML = '';

  const collection = layerCollections[groupSelect.value];

  Object.keys(collection).forEach(key => {

    const leftOption = document.createElement('option');

    leftOption.value = key;
    leftOption.textContent = key.replace('_', '-');


    const rightOption = document.createElement('option');

    rightOption.value = key;
    rightOption.textContent = key.replace('_', '-');

    leftSelect.appendChild(leftOption);
    rightSelect.appendChild(rightOption);

  });
}


//Switch which layer is active
groupSelect.addEventListener('change', function() {
  //stop an already existing swipe
  stopCurrentSwipe();

  populateSwipeLayers();
});

populateSwipeLayers();


//Actually starts the swipe
document
  .getElementById('swipeStart')
  .addEventListener('click', function() {
    
    //checks if working
    console.log('start swipe clicked');


    const groupName = groupSelect.value;

    const leftDate = leftSelect.value;
    const rightDate = rightSelect.value;

    
    console.log('Group;', groupName);
    console.log('Left:', leftDate);
    console.log('Right:', rightDate);

    //dont allow the same layer
    if (leftDate === rightDate) {
      alert('Please select two different layers');
      return;
    }



    //get the selected collection
    const collection = layerCollections[groupName];


    //get the selected layers
    const leftLayer = collection[leftDate];
    const rightLayer = collection[rightDate];


    if (!leftLayer || !rightLayer) {
      console.error('Could not find one or both selected layers.');
      return;
    }

    //Remove already active layers
    if (swipeLeftLayer || swipeRightLayer) {
      stopCurrentSwipe();  
    }

    //save current visibilty settings
    visibilityBeforeSwipe = {};

    Object.entries(collection).forEach(([key, layer]) => {
      visibilityBeforeSwipe[key] =layer.getVisible();
    });

  //Hide all layers of the group

  Object.entries(collection).forEach(([key, layer]) => {
    layer.setVisible(false);
    updateLayerCheckbox(groupName, key, false);
  });

  //Display the selected layers
  
    leftLayer.setVisible(true);
    rightLayer.setVisible(true);


    //Update corresponding checkbox
    updateLayerCheckbox(groupName, leftDate, true);
    updateLayerCheckbox(groupName, rightDate, true);

    
    //Add layers to the ol-ext swipe
    swipe.addLayer(leftLayer, false);
    swipe.addLayer(rightLayer, true);


    //Store active layers

    swipeLeftLayer = leftLayer;
    swipeRightLayer = rightLayer;

    activeSwipeGroup = groupName;

    console.log('Swipe started');

    showSwipeBox();
  });




//Stop swipe function

function stopCurrentSwipe() {

  console.log('Stopping swipe');
  
    //remove layers from swipe function
    if (swipeLeftLayer) {
      swipe.removeLayer(swipeLeftLayer);
    
    }
    if (swipeRightLayer) {
      swipe.removeLayer(swipeRightLayer);
    
    }

    //restore previous layer visibility
    if(activeSwipeGroup) {

      const collection = layerCollections[activeSwipeGroup];

      Object.entries(collection).forEach(([key, layer]) => {

        const previousVisibility = visibilityBeforeSwipe[key];

        layer.setVisible(previousVisibility);

        //keep checkboxes synced

        updateLayerCheckbox(activeSwipeGroup, key, previousVisibility);
      });
    }


    hideSwipeBox();

    //Reset swipe state

    swipeLeftLayer = null;
    swipeRightLayer = null;

    visibilityBeforeSwipe = {};

    activeSwipeGroup = null;

    console.log('Swipe stopped');
  }

document
.getElementById('swipeStop')
.addEventListener('click', function() {
  stopCurrentSwipe();
});
}
