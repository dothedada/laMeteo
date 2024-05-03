import './styles.css';
import {
    getDeviceCoords,
    getCordsFromLocation,
    getWeather,
    getImage,
} from './apiGetters';

import makeWeatherObject from './wetherObject';
import makeWeatherCards from './weatherCardDOM';

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

const renderWeather = (form, place) => {
    const locationGetter = form ? getCordsFromLocation : getDeviceCoords;
    // console.log(insertPosition);

    locationGetter(place)
        .then((cords) => getWeather(cords))
        .then((weatherInfo) => makeWeatherObject(weatherInfo))
        .then(async (cardInfo) => {
            cardInfo.imageData = await getImage(`${cardInfo.today.condition}-${cardInfo.country}`);
            makeWeatherCards(cardInfo)
        });
};

renderWeather(false);

document.querySelector('#deviceLocation').addEventListener('click', () => {
    renderWeather(false);
});

document.querySelector('#findLocation').addEventListener('click', () => {
    const locationName = document.querySelector('#manageLocation input').value;
    if (!locationName) return;
    renderWeather(true, locationName);
});

const removeWeatherDivs = (id) => {
    const divs = document.querySelectorAll(`[data-id="${id}"]`);
    divs.forEach((element) => element.remove());
};

