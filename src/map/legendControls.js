import Control from 'ol/control/Control.js';

const legends = {
    burnSeverity: {
        title: 'Burn Severity (dNBR)',
        type: 'categories',
        items: [
            {value: 1, color: '#1CF218', label: 'Enhanced regrowth - high'},
            {value: 2,color: '#88F218', label: 'Enhanced regrowth - low'},
            {value: 3,color: '#D1F218', label: 'Unburned'},
            {value: 4,color: '#EEE01B', label: 'Low severity'},
            {value: 5,color: '#F0AC19', label: 'Moderate-low severity'},
            {value: 6,color: '#F57614', label: 'Moderate-high severity'},
            {value: 7,color: '#FF0A0E', label: 'High severity'},
        ],
    },


    ndvi: {
        title: 'NDVI',
        type: 'ramp',
        unit: 'NDVI value',
        stops: [
            {value: -1.0, color: '#A60F0F'},
            {value: 0.05, color: '#DE7512'},
            {value: 0.2, color: '#F0DB0E'},
            {value: 0.4, color: '#34F00E'},
            {value: 0.6, color: '#0CC743'},
            {value: 0.8, color: '#10CAE0'},
            {value: 1.0, color: '#0891C2'},
        ],
    },

    nbr: {
        title: 'NBR',
        type: 'ramp',
        unit: 'NBR value',
        stops: [
            {value: -1.0, color: '#8c510a'},
            {value: 0.0, color: '#d8b365'},
            {value: 0.2, color: '#f6e8c3'},
            {value: 0.4, color: '#c7eae5'},
            {value: 0.6, color: '#5ab4ac'},
            {value: 0.8, color: '#01665e'},
            {value: 1.0, color: '#003c30'},
        ],
    },

        slope: {
        title: 'Slope (classes)',
        type: 'categories',
        items: [
            {value: 1, color: '#0f6385', label: '0-0.5°'},
            {value: 2, color: '#358292', label: '0.5-2°'},
            {value: 3, color: '#88aca2', label: '2-5°'},
            {value: 4, color: '#ecd9af', label: '5-10°'},
            {value: 5, color: '#d6a379', label: '10-15°'},
            {value: 6, color: '#a77c65', label: '15-30°'},
            {value: 7, color: '#745644', label: '30-45°'},
            {value: 8, color: '#573d31', label: '>45°'}
        ],
    },

            aspect : {
        title: 'Aspect (classes)',
        type: 'categories',
        items: [
            {value: 2, color: '#FF0000', label: 'North'},
            {value: 3, color: '#FF7B00', label: 'Northeast'},
            {value: 4, color: '#F6FF00', label: 'East'},
            {value: 5, color: '#48FF00', label: 'Southeast'},
            {value: 6, color: '#00FFA6', label: 'South'},
            {value: 7, color: '#0099FF', label: 'Southwest'},
            {value: 8, color: '#002FFF', label: 'West'},
            {value: 9, color: '#B300FF', label: 'Northwest'}
        ],
    },
};

//--------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------


function formatValue(value) {
    return Number(value).toFixed(2);
}


function renderRampLegend(content, legend) {
    const unit = document.createElement('p');
    unit.className = 'map-legend_unit';
    unit.textContent = legend.unit;
    content.appendChild(unit);


    const gradient = document.createElement('div');
    gradient.className = 'map-legend_gradient';
    gradient.setAttribute('aria-label', `${legend.title} color ramp`);


    const gradientStops = legend.stops
    .map((stop) => {
        const percentage =
        ((stop.value - legend.stops[0].value)/(legend.stops[legend.stops.length - 1].value - legend.stops[0].value)) * 100;

        return `${stop.color} ${percentage}%`;
    })
    .join(', ');

    gradient.style.background = `linear-gradient(to right, ${gradientStops})`;

    content.appendChild(gradient);

    const values = document.createElement('div');
    values.className = 'map-legend_ramp-values';

    legend.stops.forEach((stop) => {
        const value = document.createElement('span');
        value.textContent = formatValue(stop.value);
        value.title = `Colour: ${stop.color}`;
        values.appendChild(value);
    });

    content.appendChild(values);
}

function renderCategoryLegend(content, legend) {
    legend.items.forEach(({value, color, label}) => {
        const row = document.createElement('div');
        row.className = 'map-legend_row';

        const swatch = document.createElement('span');
        swatch.className = 'map-legend_swatch';
        swatch.style.backgroundColor = color;
        swatch.setAttribute('aria-hidden', 'true');


        const text = document.createElement('span');
        text.className = 'map-legend_label';
        text.textContent = label;


        const code = document.createElement('span');
        code.className = 'map-legend_code';
        code.textContent = String(value);


        row.append(swatch, text, code);
        content.appendChild(row);        
    });
}






export function createLegendControl() {
    const element = document.createElement('div');
    element.className = 'map-legend ol-unselectable';


    const toggle = document.createElement('button');
    toggle.className = 'map-legend_toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'true');

    const toggleLabel = document.createElement('span');
    toggleLabel.textContent = 'legend';

    const arrow = document.createElement('span');
    arrow.textContent = '▾';
    arrow.setAttribute('aria-hidden', 'true');


    toggle.append(toggleLabel, arrow);



    const content = document.createElement('div');
    content.className = 'map-legend_content';
    content.id = 'map-legend-content';

    toggle.setAttribute('aria-controls', content.id);
    element.append(toggle, content);



    function showLegend(key) {
        const legend = legends[key];

        content.replaceChildren();

        if (!legend) {
            const message = document.createElement('p');
            message.textContent = 'No legend available for this layer.';
            content.appendChild(message);
            return;
        }


        content.replaceChildren();

        const heading = document.createElement('h3');
        heading.textContent = legend.title;
        content.appendChild(heading);

        if (legend.type === 'ramp') {
            renderRampLegend(content, legend);                
        } else if (legend.type === 'categories') {
            renderCategoryLegend(content, legend);                
        }
    }



    toggle.addEventListener('click', () => {
        const collapsed = element.classList.toggle('is-collapsed');
        toggle.setAttribute('aria-expanded', String(!collapsed));
        toggle.lastElementChild.textContent = collapsed ? '▴':'▾';
    });

    const control = new Control({element});

    return {
        control,
        showLegend,
    };
}