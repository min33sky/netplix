import axios from 'axios';
import { API_BASE_PATH } from '../constants/constant';
import { IAllMovie } from '../types/movie';

/**
 * 현재 상영중인 모든 영화 가져오기
 * @returns
 */
export async function getMovies() {
  const { data } = await axios.get<IAllMovie>(
    `${API_BASE_PATH}/movie/now_playing?api_key=${process.env.REACT_APP_API_KEY}&language=ko&page=1`
  );

  return data;
}
