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
// 1. revisar la secuencia de apis, el objeto que sale de una y el que ingresa en otra
// 1.1- asignación de color en relación a las diferencias de temperatura
// 1.2- resaltar la temperatura mas alta luego de promedio mayor a 14
// 1.3- resaltar la temperatura más baja luego de promedio menor a 14
// 1.4- Ajustar scope de funciones de botones para agregar o eliminar o editar
// 1.5- ajustar el punto de inserción
// 2- limital el máximo de tarjetas
// 3- pasar datos de edicion de tarjetas
// 4- almacenar en localstorage las locaciones buscadas
// 5- quitar tarjetas
// 6- limpiar código

const modal = document.querySelector('#manageLocation');
const imgModal = document.querySelector('#zoomImage');
let insertPosition;

const openZoom = (weatherId) => {
    console.log(weatherId)
    imgModal.showModal();
};

const removeCards = (cardsId) => {
    document
        .querySelectorAll(`[data-id=${cardsId}]`)
        .forEach((card) => card.remove());
};

const selectLocationDialog = (cardsId) => {
    insertPosition = cardsId;
    modal.showModal();
};

document.body.addEventListener('click', (event) => {
    if (!event.target.closest('button')) return;

    const btn = event.target.closest('button');
    if (/close/.test(btn.className)) event.target.closest('dialog').close();

    const weatherId = btn.closest('[data-id]')
        ? btn.closest('[data-id]').getAttribute('data-id')
        : 0;
    if (!weatherId) return;

    if (/removeBTN/.test(btn.className)) removeCards(weatherId);
    if (/locationBTN/.test(btn.className)) selectLocationDialog(weatherId);
    if (/zoomBTN/.test(btn.className)) openZoom(weatherId);
});

const renderWeather = (form, insertionPoint, location) => {
    const locationGetter =
        form && location ? getCordsFromLocation : getDeviceCoords;
    // console.log(insertPosition);
    locationGetter(location)
        .then((cords) => getWeather(cords))
        .then((weatherInfo) => makeWeatherObject(weatherInfo))
        .then(async (cardInfo) => {
            const weatherCard = cardInfo;
            weatherCard.imageData = await getImage(
                `${weatherCard.now[5]}-${weatherCard.time}-${weatherCard.now[0][0]}`,
            );
            makeWeatherCards(weatherCard, insertionPoint);
        });
};

renderWeather(
    true,
    document.body.querySelector('.locationBTN').nextElementSibling,
    'buenos aires',
);

document.querySelector('#deviceLocation').addEventListener('click', () => {
    renderWeather(false);
});

document.querySelector('#findLocation').addEventListener('click', () => {
    const locationName = document.querySelector('#manageLocation input').value;
    if (!locationName) return;
    renderWeather(
        true,
        document.body.querySelector('.locationBTN').nextElementSibling,
        locationName,
    );
});
