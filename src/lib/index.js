import './styles.css';
import {
    getDeviceCoords,
    getCordsFromLocation,
    getWeather,
    getImage,
} from './apiGetters';

import makeWeatherObject from './wetherCard';

// TODO:
// 1- creación de tajetas en JS
// 1.0- creacion elementos del dom a partir de indo del API
// 1.1- asignación de color en relación a las diferencias de temperatura
// 1.2- resaltar la temperatura mas alta luego de promedio mayor a 14
// 1.3- resaltar la temperatura más baja luego de promedio menor a 14
// 2- limital el máximo de tarjetas
// 3- pasar datos de edicion de tarjetas
// 4- almacenar en localstorage las locaciones buscadas
// 5- quitar tarjetas

const modal = document.querySelector('#manageLocation');
const imgModal = document.querySelector('#zoomImage');
let insertPosition;

// Dialog functions
document.querySelectorAll('.locationBTN').forEach((button) => {
    button.addEventListener('click', () => {
        insertPosition = button.getAttribute('data-position');
        modal.showModal();
    });
});

document.querySelectorAll('.zoomBTN').forEach((button) => {
    button.addEventListener('click', () => {
        imgModal.showModal();
    });
});

const closeDialog = () =>
    document.querySelectorAll('dialog').forEach((dialog) => dialog.close());

document.querySelectorAll('.close').forEach((button) => {
    button.addEventListener('click', closeDialog);
});

const stream = (form, place) => {
    const locationGetter = form ? getCordsFromLocation : getDeviceCoords;
    console.log(insertPosition);

    locationGetter(place)
        .then((cords) => getWeather(cords))
        .then((weatherInfo) => makeWeatherObject(weatherInfo))
        .then((cardsInfo) => {
            // makeWeatherCards(cardInfo)
            console.log(JSON.stringify(cardsInfo, null, 2));
        });
};

document.querySelector('#deviceLocation').addEventListener('click', () => {
    stream(false);
});

document.querySelector('#findLocation').addEventListener('click', () => {
    const locationName = document.querySelector('#manageLocation input').value;
    if (!locationName) return;
    stream(true, locationName);
});

const testWeather = {
    hasWeather: true,
    location: 'Gondolo',
    region: 'Guera',
    country: 'Chad',
    today: {
        temp: {
            current: 42,
            min: 30,
            max: 42,
            feels: 43.1,
            heatInd: 37.5,
        },
        condition: 'Sunny',
        rain: 0,
        uv: 10,
        airCuality: 2,
        moon: 'Waning Crescent',
        moon_illumination: 44,
        nextHour: {
            temp: 39.6,
            rain: 0,
            snow: 0,
            condition: 'Sunny',
        },
        next2Hours: {
            temp: 40.7,
            rain: 0,
            snow: 0,
            condition: 'Sunny',
        },
        next3Hours: {
            temp: 41.3,
            rain: 0,
            snow: 0,
            condition: 'Sunny',
        },
    },
    tomorrow: {
        temp: {
            min: 31.8,
            max: 43.1,
            avg: 37.6,
        },
        condition: 'Sunny',
        rain: 0,
        moon: 'Waning Crescent',
    },
};

const removeWeatherDivs = (id) => {
    const divs = document.querySelectorAll(`[data-id="${id}"]`);
    divs.forEach((element) => element.remove());
};

const getUVtext = (uvIndex) => {
    const uvRecomendations = [
        'no hay radiación UV',
        'no necesitas protección',
        'no necesitas protección',
        'te recomendamos usar protección',
        'te recomendamos usar protección',
        'te recomendamos usar protección',
        'es necesario usar protección',
        'es necesario usar protección',
        'mantente a la sombra',
        'mantente a la sombra',
        'mantente a la sombra',
        '¡NO SALGAS!',
    ];
    return `índice U.V. de ${uvIndex}, ${uvRecomendations[uvIndex]}`;
};

const airCualityText = (airCualityIndex) => {
    const airCualityDescription = [
        'Buena calidad del aire',
        'Calidad del aire aceptable',
        'Aire poco saludable para las personas más sensibles',
        'Aire poco saludable',
        'El aire no es saludable',
        'El aire es tóxico',
    ];
    return airCualityDescription[airCualityIndex + 1];
};

const weatherDivs = (locationID, CSSclass) => {
    const div = document.createElement('div');
    div.setAttribute('data-id', locationID);
    div.className = CSSclass ? `${CSSclass} ${locationID}` : locationID;

    return div;
};
const weatherSpans = (content, CSSclass) => {
    const span = document.createElement('span');
    if (CSSclass) span.className = CSSclass;
    span.textContent = content;

    return span;
};

const makeWeatherCards = async (cardInfo) => {
    if (!cardInfo.hasWeather) return;

    const { today, tomorrow } = cardInfo;

    const id = `${cardInfo.location}-${Math.floor(Math.random() * new Date().getTime()).toString(26)}`;

    const localStyle = document.createElement('style');
    localStyle.textContent = `.${id} {
    --_img: url('https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fsiliconbeach-media.s3.amazonaws.com%2Flegacy%2Fblog%2Fuploads%2F2013%2F02%2FDr-Evil-google.jpg&f=1&nofb=1&ipt=26c46abd5f7a4fd0b84ec7c3a61e792081cc1cbc0cc4b92a257b0cbb2105141a&ipo=images');
    --_color: black;
    --_bk-overlay: hsl(0 0 50% / 0.5);
}
`;
    document.head.appendChild(localStyle);

    const location = weatherDivs(id);
    const name = document.createElement('h2');
    // name.className = "break"
    name.textContent = `${cardInfo.location}\n${cardInfo.country}`;
    const nameDescription = weatherSpans(
        'La siguiente información corresponde a ',
        'sr-only',
    );

    const editLocation = document.createElement('div');
    editLocation.className = 'topRow';
    const changeBTN = document.createElement('button');
    changeBTN.type = 'button';
    changeBTN.className = 'locationBTN';
    changeBTN.textContent = 'Cambiar';
    changeBTN.addEventListener('click', () => {
        insertPosition = `substitution_${id}`;
        modal.showModal();
    });
    const deleteBTN = document.createElement('button');
    deleteBTN.type = 'button';
    deleteBTN.textContent = 'Borrar';
    deleteBTN.addEventListener('click', () => {
        removeWeatherDivs(id);
    });
    editLocation.append(changeBTN, deleteBTN);

    location.append(nameDescription, name, editLocation);

    const current = weatherDivs(id, 'double');
    current.textContent = `${today.temp.current}°`;

    const dayMinMax = weatherDivs(id, 'single');
    dayMinMax.append(
        weatherSpans(`${today.temp.min}° min`),
        weatherSpans(`${today.temp.max}° max`),
    );

    const currentFeel = weatherDivs(id, 'highlight');
    currentFeel.append(
        weatherSpans(`${today.temp.feels}°`, 'double'),
        weatherSpans('sensación térmica', 'break'),
    );

    const currentHeat = weatherDivs(id, 'highlight');
    currentHeat.append(
        weatherSpans(`${today.temp.heatInd}°`, 'double'),
        weatherSpans('índice calor', 'break'),
    );

    const currentCondition = weatherDivs(id, 'break');
    currentCondition.textContent = today.condition;

    const currentWatter = weatherDivs(id, 'single');
    const currentRain = weatherSpans(`${today.rain}% lluvia`);
    const currentSnow = weatherSpans(`${today.snow}% nieve`);
    currentWatter.appendChild(currentRain);
    if (+today.snow > 0) currentWatter.appendChild(currentSnow);

    const currentAtmosphere = weatherDivs(id, 'single');
    currentAtmosphere.append(
        weatherSpans(getUVtext(+today.uv)),
        weatherSpans(airCualityText(today.airCuality)),
    );

    const currentMooon = weatherDivs(id, 'single sectionEnd');
    currentMooon.append(
        weatherSpans(`${today.moon_illumination} iluminación lunar`),
        weatherSpans(`${today.moon}`),
    );

    const nextHourTemp = weatherDivs(id);
    nextHourTemp.append(
        weatherSpans('En una hora', 'topRow'),
        weatherSpans(`${today.nextHour.temp}°`, 'double'),
    );

    const nextHourCondition = weatherDivs(id, 'break');
    nextHourCondition.textContent = today.nextHour.condition;

    const nextHourWatter = weatherDivs(id, 'single sectionEnd');
    const nextHourRain = weatherSpans(`${today.nextHour.rain}% lluvia`);
    const nextHourSnow = weatherSpans(`${today.nextHour.snow}% nieve`);
    nextHourWatter.appendChild(nextHourRain);
    if (+today.nextHour.snow > 0) nextHourWatter.appendChild(nextHourSnow);

    const next2HoursTemp = weatherDivs(id);
    next2HoursTemp.append(
        weatherSpans('En dos horas', 'topRow'),
        weatherSpans(`${today.next2Hours.temp}°`, 'double'),
    );

    const next2HoursCondition = weatherDivs(id, 'break');
    next2HoursCondition.textContent = today.next2Hours.condition;

    const next2HoursWatter = weatherDivs(id, 'single sectionEnd');
    const next2HoursRain = weatherSpans(`${today.next2Hours.rain}% lluvia`);
    const next2HoursSnow = weatherSpans(`${today.next2Hours.snow}% nieve`);
    next2HoursWatter.appendChild(next2HoursRain);
    if (+today.next2Hours.snow > 0)
        next2HoursWatter.appendChild(next2HoursSnow);

    const next3HoursTemp = weatherDivs(id);
    next3HoursTemp.append(
        weatherSpans('En tres horas', 'topRow'),
        weatherSpans(`${today.next3Hours.temp}°`, 'double'),
    );

    const next3HoursCondition = weatherDivs(id, 'break');
    next3HoursCondition.textContent = today.next3Hours.condition;

    const next3HoursWatter = weatherDivs(id, 'single sectionEnd');
    const next3HoursRain = weatherSpans(`${today.next3Hours.rain}% lluvia`);
    const next3HoursSnow = weatherSpans(`${today.next3Hours.snow}% nieve`);
    next3HoursWatter.appendChild(next3HoursRain);
    if (+today.next3Hours.snow > 0)
        next3HoursWatter.appendChild(next3HoursSnow);

    document.body.append(
        location,
        current,
        dayMinMax,
        currentFeel,
        currentHeat,
        currentCondition,
        currentWatter,
        currentAtmosphere,
        currentMooon,
        nextHourTemp,
        nextHourCondition,
        nextHourWatter,
        next2HoursTemp,
        next2HoursCondition,
        next2HoursWatter,
        next3HoursTemp,
        next3HoursCondition,
        next3HoursWatter,
    );
};

makeWeatherCards(testWeather);

// getCordsFromLocation('Bogota')
//     .then((location) => getWeather(location))
//     .then((info) => makeWeatherObject(info))
//     .then((card) => {
//         console.log(JSON.stringify(card, null, 2));
//         // getImage(`${card.today.condition}-${card.country}`);
//     })
//     .then((photo) => {
//         // img.setAttribute('src', photo.url);
//         // img.setAttribute('alt', photo.alt.es);
//     });
