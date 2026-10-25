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
        unit: 'NDVI value'
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
        unit: 'NBR value'
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
            {value: 1, color: '#FFFFFF', label: ''},
            {value: 2, color: '#6FCC18', label: ''},
            {value: 3, color: '#186FCC', label: ''},
            {value: 4, color: '#7518CC', label: ''},
            {value: 5, color: '#18CC90', label: ''},
            {value: 6, color: '#F57614', label: ''},
            {value: 7, color: '#E02B3A', label: ''},
            {value: 8, color: '#E0CB2B', label: ''}
        ],
    },

            aspect : {
        title: 'Aspect (classes)',
        type: 'categories',
        items: [
            {value: 2, color: '#FFFFFF', label: ''},
            {value: 3, color: '#6FCC18', label: ''},
            {value: 4, color: '#186FCC', label: ''},
            {value: 5, color: '#7518CC', label: ''},
            {value: 6, color: '#18CC90', label: ''},
            {value: 7, color: '#F57614', label: ''},
            {value: 8, color: '#E02B3A', label: ''},
            {value: 9, color: '#E0CB2B', label: ''}
        ],
    },
};

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