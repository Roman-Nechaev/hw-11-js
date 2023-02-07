import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import catdsTml from './template/gallery-cards.hbs';
import LoadMoreBtn from './components/load-more-btn';
import NewApiService from './API/api-servise';
import InfiniteScroll from 'infinite-scroll';

const inputRef = document.querySelector('#search-form');
const galletyBoxRef = document.querySelector('.gallery');
const loadMoreBtnRef = document.querySelector('[data-action="load-more"]');
const endOfContent = document.querySelector('.end-content');
const paginationBtn = document.querySelector('.pagination-choices');

inputRef.addEventListener('submit', onInput);
loadMoreBtnRef.addEventListener('click', onBtnloadMore);
paginationBtn.addEventListener('input', onPaginationBtn);

let checkTest;
let isFlagForQuantity = false;

const newApiService = new NewApiService();
function onPaginationBtn(e) {
  const { value } = e.target;

  if (value === 'scroll-check') {
    return (checkTest = value);
  } else {
    return (checkTest = value);
  }
}

function onInput(e) {
  e.preventDefault();
  const { value } = e.currentTarget.elements.searchQuery;

  if (value === '') {
    Notify.info('Поле ввода не должно быть пустым!!!');
    return;
  }

  loadMoreBtn.hide();
  clearFace();
  newApiService.resetPage();
  newApiService.query = value;
  processingRequest();

  if (checkTest === 'scroll-check') {
    loadMoreInfiniti();
  }

  paginationBtn.classList.add('is-hidden');
  endOfContent.classList.add('is-hidden');
  isFlagForQuantity = true;
}

function renderGalleryCatds(data) {
  galletyBoxRef.insertAdjacentHTML('beforeend', catdsTml(data));

  loadMoreBtn.enable();
  lightbox.refresh();
  isFlagForQuantity = false;
}

function onBtnloadMore() {
  newApiService.incrementPage();
  processingRequest();
  loadMoreBtn.disable();
}

async function processingRequest() {
  try {
    const respons = await newApiService.fetchGalerryApi();

    const dataGallery = await respons.hits;
    const totalNumberOfImages = await respons.totalHits;

    if (!totalNumberOfImages) {
      loadMoreBtn.hide();
      Notify.failure(
        'К сожалению, нет изображений, соответствующих вашему поисковому запросу. Пожалуйста, попробуйте еще раз.'
      );
      return;
    } else if (dataGallery.length <= 0) {
      loadMoreBtn.hide();
      endOfContent.classList.remove('is-hidden');
      return;
    }

    if (isFlagForQuantity) {
      Notify.info(`Ура! Мы нашли ${totalNumberOfImages} изображений.`);
    }

    renderGalleryCatds(dataGallery);
    if (checkTest === 'scroll-check') {
      loadMoreBtn.hide();
      return;
    }

    loadMoreBtn.show();
  } catch (error) {
    console.log(error);
  }
}

function clearFace() {
  galletyBoxRef.innerHTML = '';
}

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

var lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

function loadMoreInfiniti() {
  new InfiniteScroll('.gallery', {
    path: getPenPath,
    append: false,
    append: '.gallery',

    status: '.page-load-status',
  });
}

function getPenPath() {
  newApiService.incrementPage();
  return `${processingRequest()}`;
}
