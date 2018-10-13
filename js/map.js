'use strict';

var pins = {};
var OFFSET_TO_STICK = 47;
var arrayEl = [];
var generateRandom = function (randomCount, minCount) {
  minCount = typeof minCount !== 'undefined' ? minCount : 0; // Задание значение по умолчанию
  var tRandom = Math.floor((Math.random() * randomCount));
  if (tRandom === randomCount) {
    tRandom--;
  }
  if (tRandom < minCount) {
    tRandom = minCount;
  }
  return tRandom;
};
var arrayTitle = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var arrayType = [
  'palace',
  'flat',
  'house',
  'bungalo'
];
var arrayFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var arrayPhotos = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var generateArray = function (array) {
  for (var i = 0; i < 8; i++) {
    array[i] = {
      id: i,
      author: {
        avatar: 'img/avatars/user0' + generateRandom(8, 1) + '.png'
      },
      offer: {
        title: arrayTitle[generateRandom(8)],
        address: '600, 350',
        price: generateRandom(1000000, 1000),
        type: arrayType[generateRandom(4)],
        rooms: generateRandom(5, 1),
        guests: generateRandom(8, 1),
        checkin: '12:00',
        checkout: '14:00',
        features: arrayFeatures,
        description: 'Крутое описание',
        photos: arrayPhotos,
      },
      location: {
        x: generateRandom(630, 160),
        y: generateRandom(630, 160),
      }
    };
  }
};

generateArray(arrayEl);

var fragment = document.createDocumentFragment();
var templatePin = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');

var renderPins = function (pin) {
  var tempPin = templatePin.cloneNode(true);
  tempPin.style.left = pin.location.x + 'px';
  tempPin.style.top = pin.location.y + 'px';
  tempPin.querySelector('img').src = pin.author.avatar;
  tempPin.querySelector('img').alt = pin.offer.title;
  tempPin.id = 'pin-id--' + pin.id;
  return tempPin;
};

for (var index = 0; index < arrayEl.length; index++) {
  fragment.appendChild(renderPins(arrayEl[index]));
}

var renderType = function (type) {
  if (type === 'flat') {
    return 'Квартира';
  }
  if (type === 'bungalo') {
    return 'Бунгало';
  }
  if (type === 'house') {
    return 'Дом';
  }
  if (type === 'palace') {
    return 'Дворец';
  }
  return 'Неопознанный тип';
};
var renderFeatures = function (features) {
  var fragmentFeatures = document.createDocumentFragment();
  for (var i = 0; i < features.length; i++) {
    var liFeature = document.createElement('li');
    liFeature.className = 'popup__feature popup__feature--' + features[i];
    fragmentFeatures.appendChild(liFeature);
  }
  return fragmentFeatures;
};

var renderPhotos = function (photos) {
  var fragmentPhoto = document.createDocumentFragment();
  for (var i = 0; i < photos.length; i++) {
    var tempImg = document.createElement('img');
    tempImg.src = photos[i];
    tempImg.width = 45;
    tempImg.height = 40;
    tempImg.alt = 'Фотография жилья';
    fragmentPhoto.appendChild(tempImg);
  }
  return fragmentPhoto;
};

var templateCard = document.querySelector('#card').content.querySelector('.map__card');

var renderCard = function (card) {
  var tempCard = templateCard.cloneNode(true);
  var tempFeature = tempCard.querySelector('.popup__features');
  for (var i = tempFeature.children.length; i > 0; i--) {
    tempFeature.removeChild(tempFeature.children[(i - 1)]);
  }

  var tempPhotos = tempCard.querySelector('.popup__photos');
  for (i = tempPhotos.children.length; i > 0; i--) {
    tempPhotos.removeChild(tempPhotos.children[(i - 1)]);
  }

  tempCard.querySelector('.popup__title').textContent = card.offer.title;
  tempCard.querySelector('.popup__text--address').textContent = card.offer.address;
  tempCard.querySelector('.popup__text--price').textContent = card.offer.price + '₽/ночь';
  tempCard.querySelector('.popup__type').textContent = renderType(card.offer.type);
  tempCard.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
  tempCard.querySelector('.popup__text--time').textContent = 'Заезд после' + card.offer.checkin + ', выезд до' + card.offer.checkout;
  tempCard.querySelector('.popup__features').appendChild(renderFeatures(card.offer.features));
  tempCard.querySelector('.popup__description').textContent = card.offer.description;
  tempCard.querySelector('.popup__avatar').src = card.author.avatar;
  tempCard.querySelector('.popup__photos').appendChild(renderPhotos(card.offer.photos));
  return tempCard;
};

var generateHandlerForPins = function (elPins) {
  for (var i = 1; i < elPins.length; i++) {
    elPins[i].addEventListener('click', cardShowHandler);
  }
};

var cardShowHandler = function (evt) {
  var cardSection = document.querySelector('.map');
  var cardID = evt.target.parentNode.id.slice(-1); // получаем id элемента массивы через родителя img
  cardSection.insertBefore(renderCard(arrayEl[cardID]), document.querySelector('.map__filters-container'));
};

var activatePageHandler = function () {
  document.querySelector('.map').classList.remove('map--faded');
  document.querySelector('.ad-form').classList.remove('ad-form--disabled');
  var listFieldsets = document.querySelectorAll('.ad-form fieldset');
  for (var i = 0; i < listFieldsets.length; i++) {
    listFieldsets[i].disabled = false;
  }
  mapPins.appendChild(fragment);
  pins = document.querySelectorAll('.map__pin');
  generateHandlerForPins(pins);
};
var getCoordinat = function (offsetY) {
  offsetY = typeof offsetY !== 'undefined' ? offsetY : 0; // Задание значение по умолчанию
  var tPin = document.querySelector('.map__pin--main');
  var x = tPin.offsetLeft + tPin.clientWidth / 2;
  var y = tPin.offsetTop + tPin.clientHeight / 2 + offsetY;
  document.querySelector('#address').value = Math.floor(x) + ', ' + Math.floor(y);
}
var getCoordinatHandler = function () {
  getCoordinat(OFFSET_TO_STICK);
};
getCoordinat();
document.querySelector('.map__pin--main').addEventListener('mouseup', activatePageHandler);
document.querySelector('.map__pin--main').addEventListener('mouseup', getCoordinatHandler);

console.log(pins);

