'use strict';

var arrayEl = [];
var generateRandom = function (randomCount, minCount) {
  minCount = typeof minCount !== 'undefined' ? minCount : 0;
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

document.querySelector('.map').classList.remove('map--faded');

var fragment = document.createDocumentFragment();
var templatePin = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');

var renderPins = function (pin) {
  var tempPin = templatePin.cloneNode(true);
  tempPin.style.left = pin.location.x + 'px';
  tempPin.style.top = pin.location.y + 'px';
  tempPin.querySelector('img').src = pin.author.avatar;
  tempPin.querySelector('img').alt = pin.offer.title;
  return tempPin;
};

for (var index = 0; index < arrayEl.length; index++) {
  fragment.appendChild(renderPins(arrayEl[index]));
}

mapPins.appendChild(fragment);

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
  console.dir(tempCard.querySelector('.popup__features').children);
  return tempCard;
};

var cardSection = document.querySelector('.map');
cardSection.insertBefore(renderCard(arrayEl[0]), document.querySelector('.map__filters-container'));


