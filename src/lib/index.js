import './styles.css';
import {
    getDeviceCoords,
    getCordsFromLocation,
    getWeather,
    getImage,
} from './apiGetters';
import makeWeatherObject from './wetherObject';
import makeWeatherCards from './weatherCardDOM';

const modal = document.querySelector('#manageLocation');
let insertion = 'head';

const setInsertPoint = (place = 'head') => {
    const defaultPoints = document.body.querySelectorAll('.locationBTN');
    if (/head/.test(place)) return defaultPoints[0].nextElementSibling;
    if (/tail/.test(place)) return defaultPoints[defaultPoints.length - 1];
    return document.body.querySelector(`.${place}`);
};

const openZoom = (weatherId) => {
    const zoomModal = document.querySelector(`#${weatherId}`);
    zoomModal.showModal();
};

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

document.querySelector('#location').addEventListener('keydown', (event) => {
        const placeName = document.querySelector('input');
    if (event.key === 'Enter') {
        if (!placeName.value) event.preventDefault();
        renderWeather(true, setInsertPoint(insertion), placeName.value);
        placeName.value = ''
        
    }
});

document.body.addEventListener('click', (event) => {
    if (!event.target.closest('button')) return;
    const btn = event.target.closest('button');

    if (/close/.test(btn.className)) event.target.closest('dialog').close();
    if (/^find/.test(btn.id)) {
        const placeName = document.querySelector('input');
        renderWeather(true, setInsertPoint(insertion), placeName.value);
        placeName.value = ''
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
    if (/zoomBTN/.test(btn.className)) openZoom(weatherId);
});

const placesInLocal = Object.keys(localStorage);
if (placesInLocal.length) {
    placesInLocal.forEach((place, index) => {
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
    });
} else {
    renderWeather(false, setInsertPoint());
}
