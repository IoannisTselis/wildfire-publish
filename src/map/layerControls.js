function createRasterControls(
  containerId,
  layerCollection,
  prefix,
  groupName,
  onLayerChange = () => {}
) {
  const container = document.getElementById(containerId);

  const details = document.createElement('details');
  details.className = 'raster-group';

  const summary = document.createElement('summary');
  summary.textContent = groupName;

  details.appendChild(summary);



  Object.entries(layerCollection).forEach(([date, layer]) => {
    
    const row = document.createElement('div');
    row.className = 'raster-layer';
    
    //Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `${prefix}_${date}`;

    //Date label
    const label = document.createElement('label');
    label.htmlFor = checkbox.id;
    label.textContent = date.replace('_', '-');

    //Oppacity slider
    const opacity = document.createElement('input');
    opacity.type = 'range';
    opacity.min = '0';
    opacity.max = '1';
    opacity.step = '0.01';
    opacity.value = '1';

    //Opacity percentage
    const opacityValue = document.createElement('span');

    opacityValue.textContent = '100%';


    //Show/hide layers
    checkbox.addEventListener('change', function() {
      layer.setVisible(this.checked);
      onLayerChange(layer, this.checked);
    });

    //Change opacity
    opacity.addEventListener('input', function() {
      const value = Number(this.value);

      layer.setOpacity(value);

      opacityValue.textContent = `${Math.round(value * 100)}%`;
    });

    row.appendChild(checkbox);
    row.appendChild(label);
    row.appendChild(opacity);
    row.appendChild(opacityValue);

    details.appendChild(row);

  });

  container.appendChild(details);

}



//===============================================================================



export function initialiseLayerControls({
    ndviLayers,
    nbrLayers,
    dnbrLayers,
    burnSeverityLayer,
    terrainLayers,
    onActiveLayerChange = () => {}
}) {


  let activeLayer = null;

  const allLayers = [
    {
      key: 'ndvi',
      layers: Object.values(ndviLayers)
    },

    {
      key: 'nbr',
      layers: Object.values(nbrLayers)
    },

    {
      key:'burnSeverity',
      layers: [...Object.values(dnbrLayers), burnSeverityLayer]
    },

    {
      key: 'slope',
      layers: [terrainLayers.slopeClass]
    },

    {
      key: 'aspect',
      layers: [terrainLayers.aspectClass]
    }
  ];


  function updateLegend(changedLayer, isVisible, legendKey) {
    if (isVisible) {
      activeLayer = { layer: changedLayer, key: legendKey};
      onActiveLayerChange(legendKey);
      return;
    }

    if (activeLayer?.layer === changedLayer) {
      activeLayer = null;


      for (const group of allLayers) {
        const visibleLayer = group.layers.find(
          layer =>
            layer &&
          layer.getVisible() &&
          layer !== changedLayer
        );

        if (visibleLayer) {
          activeLayer = {
            layer: visibleLayer,
            key: group.key
          };
          break;
        }
      }

      onActiveLayerChange(activeLayer?.key ?? null);
    }
  }


  createRasterControls(
  'ndviControls',
  ndviLayers,
  'ndvi',
  'NDVI',
  (layer, visible) =>
    updateLegend(layer, visible, 'ndvi')
);

createRasterControls(
  'nbrControls',
  nbrLayers,
  'nbr',
  'NBR',
  (layer, visible) =>
    updateLegend(layer, visible, 'nbr')
);

createRasterControls(
  'dnbrControls',
  dnbrLayers,
  'dnbr',
  'dNBR'
);

//Burn Severity checkbox
const burnSeverityCheckbox = 
document.getElementById('BurnSeverityCheckbox');

if (burnSeverityCheckbox) {
  burnSeverityCheckbox.checked = burnSeverityLayer.getVisible();

  burnSeverityCheckbox.addEventListener('change', function() {
    burnSeverityLayer.setVisible(this.checked);
    updateLegend(burnSeverityLayer, this.checked, 'burnSeverity');
  });  
}




const slopeCheckbox = document.getElementById('slopeCheckbox');

if (slopeCheckbox) {
  slopeCheckbox.checked = terrainLayers.slopeClass.getVisible();

  slopeCheckbox.addEventListener('change', function() {
    const layer = terrainLayers.slopeClass;
    layer.setVisible(this.checked);
    updateLegend(layer, this.checked, 'slope');
  });  
}

const aspectCheckbox = document.getElementById('aspectCheckbox');

if (aspectCheckbox) {
  aspectCheckbox.checked = terrainLayers.aspectClass.getVisible();

  aspectCheckbox.addEventListener('change', function() {
    const layer = terrainLayers.aspectClass;
    layer.setVisible(this.checked);
    updateLegend(layer, this.checked, 'aspect');
  });  
}
}