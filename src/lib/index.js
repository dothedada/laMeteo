import './styles.css'
import {
    getIPlocation,
    getDeviceCoords,
    getCordsFromLocation,
    getWeather,
    getImage,
} from './apiGetters';

import makeWeatherObject from './wetherCard';

// TODO:
// 1- Ventana de dialogo de locacion
// a- Cálculo de parámetros para la interfase (temperatura, Dif temperatura con percepcion, hora del día, probabilidad de lluvia...)
// b- crear la estructura de tarjetas
// d-
//
//

const modal = document.querySelector('#manageLocation')
document.querySelectorAll('.locationBTN').forEach(button => {
    button.addEventListener('click', () => {
        const insertPosition = button.getAttribute('data-position')
        console.log(insertPosition)
        modal.showModal()
    })
})

const imgModal = document.querySelector('#zoomImage')
document.querySelectorAll('.zoomBTN').forEach(button => {
    button.addEventListener('click', () => {
        imgModal.showModal()
    })

})

document.querySelectorAll('dialog .close').forEach(button => {
    button.addEventListener('click', () => {
        console.log('carajo')
        modal.close()
        imgModal.close()
    })
})

// const img = document.createElement('img');
// document.body.append(img);

// getCordsFromLocation('NY')
//     .then((location) => getWeather(location))
//     .then((info) => makeWeatherObject(info))
//     .then((card) => {
//         console.log(JSON.stringify(card, null, 2));
        // getImage(`${card.today.condition}-${card.country}`);
    // })
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
