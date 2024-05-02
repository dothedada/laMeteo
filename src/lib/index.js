import './styles.css';
import {
    getIPlocation,
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
//
//

const modal = document.querySelector('#manageLocation');
let insertPosition
document.querySelectorAll('.locationBTN').forEach((button) => {
    button.addEventListener('click', () => {
        insertPosition = button.getAttribute('data-position');
        modal.showModal();
    });
});

const imgModal = document.querySelector('#zoomImage');
document.querySelectorAll('.zoomBTN').forEach((button) => {
    button.addEventListener('click', () => {
        imgModal.showModal();
    });
});

document.querySelectorAll('dialog .close').forEach((button) => {
    button.addEventListener('click', () => {
        modal.close();
        imgModal.close();
    });
});

const stream = (form, place) => {
    const locationGetter = form ? getCordsFromLocation : getDeviceCoords;
        console.log(insertPosition);

    locationGetter(place)
        .then((cords) => getWeather(cords))
        .then((weatherInfo) => makeWeatherObject(weatherInfo))
        .then((cardsInfo) => {
            // makeWeatherCards(cardsInfo)
            console.log(JSON.stringify(cardsInfo, null, 2));
        });
};

document.querySelector('#deviceLocation').addEventListener('click', () => {
    stream(false);
});

document.querySelector('#findLocation').addEventListener('click', () => {
    stream(true, document.querySelector('#manageLocation input').value);
});

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

// US - EPA standard.
// 1 means Good
// 2 means Moderate
// 3 means Unhealthy for sensitive group
// 4 means Unhealthy
// 5 means Very Unhealthy
// 6 means Hazardous
