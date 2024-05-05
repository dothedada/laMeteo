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
// 1.2- resaltar la temperatura mas alta luego de promedio mayor a 14
// 1.3- resaltar la temperatura más baja luego de promedio menor a 14
// 2- cargar modal de imagen adecuado
// 3- mejorar el formulario de edicion de lugares
// 3- pasar datos de edicion de tarjetas
// 6- limpiar código

const modal = document.querySelector('#manageLocation');
// const imgModal = document.querySelector('#zoomImage');
let insertion = 'head';

const setInsertPoint = (place = 'head') => {
    const defaultPoints = document.body.querySelectorAll('.locationBTN');
    if (/head/.test(place)) return defaultPoints[0].nextElementSibling;
    if (/tail/.test(place)) return defaultPoints[defaultPoints.length - 1];
    return document.body.querySelector(`.${place}`);
};

// const openZoom = (weatherId) => {
// console.log(weatherId);
// imgModal.showModal();
// };

const removeCards = (weatherId) => {
    document
        .querySelectorAll(`[data-id=${weatherId}]`)
        .forEach((card) => card.remove());
    localStorage.removeItem(`lameteo_${weatherId}`);
};

const selectLocationDialog = (cardsId) => {
    insertion = cardsId;
    modal.showModal();
};

const renderWeather = (form, insertPoint, location) => {
    const cords = form && location ? getCordsFromLocation : getDeviceCoords;
    cords(location)
        .then((cordsData) => getWeather(cordsData))
        .then((weatherInfo) => makeWeatherObject(weatherInfo))
        .then(async (cardInfo) => {
            const weatherCard = cardInfo;

            weatherCard.imageData = await getImage(
                `${weatherCard.time}-${weatherCard.now[0][0]}-${weatherCard.now[5]}`,
            );
            makeWeatherCards(weatherCard, insertPoint);
        })
        .then(() => {
            if (!/head|tail/.test(insertion)) removeCards(insertion);
            insertion = 'head';
        });
};

document.body.addEventListener('click', (event) => {
    if (!event.target.closest('button')) return;
    const btn = event.target.closest('button');

    if (/close/.test(btn.className)) event.target.closest('dialog').close();
    if (/^find/.test(btn.id)) {
        const placeName = document.querySelector('input').value;
        renderWeather(true, setInsertPoint(insertion), placeName);
        modal.close();
    }
    if (/^device/.test(btn.id)) {
        renderWeather(false, setInsertPoint(insertion));
        modal.close();
    }

    const weatherId = btn.closest('[data-id]')
        ? btn.closest('[data-id]').getAttribute('data-id')
        : 0;
    if (!weatherId) return;

    if (/removeBTN/.test(btn.className)) removeCards(weatherId);
    if (/locationBTN/.test(btn.className)) selectLocationDialog(weatherId);
    // if (/zoomBTN/.test(btn.className)) openZoom(weatherId);
});

const placesInLocal = Object.keys(localStorage);
if (placesInLocal) {
    placesInLocal.forEach((place,index) => {
        setTimeout(() => {
            getWeather(localStorage.getItem(place).split(','))
                .then((weatherInfo) => makeWeatherObject(weatherInfo))
                .then(async (cardInfo) => {
                    const weatherCard = cardInfo;

                    weatherCard.imageData = await getImage(
                        `${weatherCard.time}-${weatherCard.now[0][0]}-${weatherCard.now[5]}`,
                    );
                    makeWeatherCards(weatherCard, setInsertPoint());
                });
            localStorage.removeItem(place);
        }, 1000 * index);
    })

} else {
    renderWeather(true, setInsertPoint(), 'Bogota');
}
