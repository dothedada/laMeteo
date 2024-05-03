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

const makeWeatherCards = (weatherInfo, insertionPoint) => {
    if (!weatherInfo) return;

    const { now, nextHour, next2Hours, next3Hours, tomorrow } = weatherInfo;
    const id = `${now[0][0]}_${new Date().getTime().toString(26)}`;
    let locationTitle = true;

    const renderCard = (cardData, renderPicture = false) => {
        let card;

        if (locationTitle) {
            card = weatherDivs(id, 'highlight');

            const locationName = weatherSpans('Este es el clima de', 'sr-only');
            const title = document.createElement('h2');
            title.className = 'single';
            title.append(
                locationName,
                weatherSpans(cardData[0]),
                weatherSpans(cardData[1]),
            );

            const editLocation = document.createElement('div');
            editLocation.className = 'topRow';

            const changeLocationBTN = document.createElement('button');
            changeLocationBTN.className = 'locationBTN';
            changeLocationBTN.type = 'button';
            changeLocationBTN.textContent = 'Cambiar';

            const deleteLocationBTN = document.createElement('button');
            deleteLocationBTN.type = 'button';
            deleteLocationBTN.textContent = 'Borrar';
            editLocation.append(changeLocationBTN, deleteLocationBTN);

            card.append(title, editLocation);
        } else if (renderPicture) {
            card = document.createElement('picture');

            const image = document.createElement('img');
            image.src = cardData.thumb;
            image.alt = cardData.alt;

            const imgBTN = document.createElement('button');
            imgBTN.type = 'button';
            imgBTN.className = 'zoomBTN';
            imgBTN.textContent = 'zoom';

            card.append(image, imgBTN);
        } else if (typeof cardData !== 'object') {
            card = /°/.test(cardData)
                ? weatherDivs(id, 'double')
                : weatherDivs(id);
            card.textContent = cardData;
        } else if (/°$/.test(cardData[0])) {
            card = weatherDivs(id, 'highlight');
            card.append(
                weatherSpans(cardData[0], 'double'),
                weatherSpans(cardData[1], 'break'),
            );
        } else {
            card = weatherDivs(id, 'single');
            card.append(weatherSpans(cardData[0]), weatherSpans(cardData[1]));
        }

        const cardInsertion = locationTitle
            ? insertionPoint
            : document.body.querySelectorAll(`.${id}`)[
                  document.body.querySelectorAll(`.${id}`).length - 1
              ].nextElementSibling;

        document.body.insertBefore(card, cardInsertion);
        locationTitle = false;
    };

    const localStyle = document.createElement('style');
    localStyle.textContent = `.${id} {
        --_img: url(${weatherInfo.imageData.url});
        --_color: black;
        --_bk-overlay: hsl(0 0 90% / 0.6);
    }`;

    document.head.appendChild(localStyle);

    now.forEach((cardData) => renderCard(cardData));
    nextHour.forEach((cardData) => renderCard(cardData));
    next2Hours.forEach((cardData) => renderCard(cardData));
    next3Hours.forEach((cardData) => renderCard(cardData));
    tomorrow.forEach((cardData) => renderCard(cardData));
    renderCard(weatherInfo.imageData, true);
};

export default makeWeatherCards;
