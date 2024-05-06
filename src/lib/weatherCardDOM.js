const makeDiv = (locationID, CSSclass) => {
    const div = document.createElement('div');
    div.setAttribute('data-id', locationID);
    div.className = CSSclass ? `${CSSclass} ${locationID}` : locationID;

    return div;
};
const makeSpan = (content, CSSclass) => {
    const span = document.createElement('span');
    if (CSSclass) span.className = CSSclass;
    span.textContent = content;

    return span;
};

const makeBTN = (text, className) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = className;
    btn.textContent = text;

    return btn;
};

const makeHue = (tempStr) => {
    const minReg = 5; // se elimina el - al número negativo
    const maxReg = 35;

    let temp = +tempStr.replace('°', '');
    if (temp < -minReg) temp = -minReg;
    if (temp > maxReg) temp = maxReg;
    const percent = ((temp + minReg) / (maxReg + minReg)) * 100;

    const minHue = 0;
    const maxHue = 230;
    const hue = minHue + (percent / 100) * (maxHue - minHue) - maxHue;

    return Math.round(Math.abs(hue));
};

const makePercent = (perceivedStr, tempStr) => {
    const min = 0;
    const max = 10;
    const scalingFactor = 2; // para hacer más evidente el cambio de color

    let diference =
        Math.abs(+perceivedStr.replace('°', '') - +tempStr.replace('°', '')) *
        scalingFactor;
    if (diference > max) diference = max;

    return Math.round((diference / (max - min)) * 100);
};

const makeColor = (temp, feel, heat) =>
    `${makeHue(temp)} ${makePercent(feel, temp)}% ${makePercent(heat, temp) / 2}%`;

const setHighlight = (thisValue, comparison1, comparison2) => {
    let highlight = 3;
    if (thisValue < comparison1) highlight -= 1;
    if (thisValue < comparison2) highlight -= 1;
    return highlight;
};

const makeWeatherCards = (weatherInfo, insertionPoint) => {
    const id = `${weatherInfo.now[0][0].replace(' ', '-')}_${new Date().getTime().toString(26)}`;
    const { now, nextHour, next2Hours, next3Hours, tomorrow } = weatherInfo;

    let firstCard = true;
    let sectionTitle;

    const renderCard = (data, last, renderPicture = false) => {
        let card;

        if (firstCard) {
            card = makeDiv(id, 'highlight');

            const title = document.createElement('h2');
            title.className = 'single';
            title.append(
                makeSpan('Este es el clima de', 'sr-only'),
                makeSpan(data[0]),
                makeSpan(data[1]),
            );

            const editLocation = document.createElement('div');
            editLocation.className = 'topRow';
            editLocation.append(
                makeBTN('Cambiar', 'locationBTN'),
                makeBTN('Borrar', 'removeBTN'),
            );

            card.append(title, editLocation);
        } else if (renderPicture) {
            card = document.createElement('picture');
            card.setAttribute('data-id', id);
            card.className = id;

            const image = document.createElement('img');
            image.src = data.thumb;
            image.alt = data.alt;

            card.append(image, makeBTN('zoom', 'zoomBTN'));

            // crear modal de dialogo
            const dialog = document.createElement('dialog');
            dialog.id = id;
            dialog.className = 'zoomImage'

            const close = makeBTN('cerrar', 'close');

            const imageBig = document.createElement('img');
            imageBig.src = data.url;
            imageBig.alt = data.thumb;

            const imageCredits = document.createElement('div');
            imageCredits.innerHTML = data.html;

            dialog.append(close, imageBig, imageCredits);
            document.body.appendChild(dialog);
        } else if (typeof data !== 'object') {
            card = /°/.test(data) ? makeDiv(id, 'double') : makeDiv(id);
            card.textContent = data;
        } else if (/°$/.test(data[0])) {
            card = makeDiv(id, 'highlight');
            card.append(
                makeSpan(data[0], 'double'),
                makeSpan(data[1], 'break'),
            );
        } else if (sectionTitle) {
            card = makeDiv(id, 'highlight');
            card.append(
                makeSpan(data[0], 'topRow'),
                makeSpan(data[1], 'double'),
            );
            sectionTitle = false;
        } else {
            card = makeDiv(id, 'single');
            card.append(makeSpan(data[0]), makeSpan(data[1]));
        }

        if (last) {
            card.classList.add('sectionEnd');
            sectionTitle = true;
        }

        const siblings = document.body.querySelectorAll(`.${id}`);

        const cardInsertion = firstCard
            ? insertionPoint
            : siblings[siblings.length - 1].nextElementSibling;

        document.body.insertBefore(card, cardInsertion);
        firstCard = false;
    };

    const cardStyle = document.createElement('style');
    cardStyle.textContent = `.${id} {
        --_img: url(${weatherInfo.imageData ? weatherInfo.imageData.url : ''});
        --_color: hsl(${makeColor(weatherInfo.now[1], weatherInfo.now[3][0], weatherInfo.now[4][0])} / 1);
        --_bk-overlay: hsl(${makeHue(weatherInfo.now[1])} 30% 90% / 0.9);
    }`;
    document.head.appendChild(cardStyle);

    now.forEach((data, index, { length }) =>
        renderCard(data, index === length - 1),
    );
    nextHour.forEach((data, index, { length }) =>
        renderCard(data, index === length - 1),
    );
    next2Hours.forEach((data, index, { length }) =>
        renderCard(data, index === length - 1),
    );
    next3Hours.forEach((data, index, { length }) =>
        renderCard(data, index === length - 1),
    );
    tomorrow.forEach((data, index, { length }) =>
        renderCard(data, index === length - 1),
    );
    if (weatherInfo.imageData) renderCard(weatherInfo.imageData, false, true);

    localStorage.setItem(`lameteo_${id}`, [weatherInfo.lat, weatherInfo.lon]);
};

export default makeWeatherCards;
