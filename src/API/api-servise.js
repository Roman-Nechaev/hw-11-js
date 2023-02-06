import axios from 'axios';
import { key } from '../key/pixabay-key';

export default class NewApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  async fetchGalerryApi() {
    const BASE_URL = 'https://pixabay.com/api/';
    const options = {
      params: {
        key: key,
        q: `${this.searchQuery}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: this.page,
        per_page: 40,
      },
    };

    const response = await axios.get(BASE_URL, options);
    const gatherData = await response.data;
    // this.incrementPage();
    return gatherData;
  }
  incrementPage() {
    return (this.page += 1);
  }
  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
