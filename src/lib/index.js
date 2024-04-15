import './styles.css'
import {
    getIPlocation,
    getDeviceCoords,
    getCordsFromLocation,
    getWeather,
    getImage,
} from './apiGetters';

import makeWeatherObject from './wetherCard';

// NOTE:
// a- Cálculo de parámetros para la interfase (temperatura, Dif temperatura con percepcion, hora del día, probabilidad de lluvia...)
// b- crear la estructura de tarjetas
// c- crear el css
// d-

const img = document.createElement('img');
document.body.append(img);

getCordsFromLocation('NY')
    .then((location) => getWeather(location))
    .then((info) => makeWeatherObject(info))
    .then((card) => {
        console.log(JSON.stringify(card, null, 2));
        // getImage(`${card.today.condition}-${card.country}`);
    })
    // .then((photo) => {
    //     img.setAttribute('src', photo.url);
    //     img.setAttribute('alt', photo.alt.es);
    // });

// US - EPA standard.
// 1 means Good
// 2 means Moderate
// 3 means Unhealthy for sensitive group
// 4 means Unhealthy
// 5 means Very Unhealthy
// 6 means Hazardous
