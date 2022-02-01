import axios from 'axios';
import { API_BASE_PATH } from '../constants/constant';
import { ISearch } from '../types/search';

export async function searchMovieAndTVShow(keyword: string, page?: number) {
  const { data } = await axios.get<ISearch>(
    `${API_BASE_PATH}/search/multi?api_key=${
      process.env.REACT_APP_API_KEY
    }&language=ko&query=${keyword}&page=${page || 1}&include_adult=false`
  );

  return data;
}
