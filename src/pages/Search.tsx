import { motion } from 'framer-motion';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { searchMovieAndTVShow } from '../api/search';
import { makeImagePath } from '../utils/movie';
import { NETFLIX_LOGO_URL } from './Home';

const Wrapper = styled.div`
  padding: 100px 20px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  row-gap: 40px;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: #741414;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  cursor: pointer;

  /* 가장 오른쪽 아이템  */
  &:nth-child(6n) {
    transform-origin: center right;
  }

  /* 가장 왼쪽 아이템 */
  &:nth-child(6n + 1) {
    transform-origin: center left;
  }
`;

const SearchKeyword = styled.h2`
  font-weight: 600;
  font-size: 28px;
  margin-bottom: 40px;
`;

/**
 * 검색 페이지
 * @returns
 */
function Search() {
  const location = useLocation();
  const [page, setPage] = useState(1);
  const keyword = new URLSearchParams(location.search).get('keyword');

  const { data, isLoading } = useQuery(['search', keyword, page], () =>
    searchMovieAndTVShow(keyword || '', page)
  );

  return (
    <>
      {isLoading ? (
        <p>Loading....</p>
      ) : (
        <Wrapper>
          <SearchKeyword>검색어: {keyword}</SearchKeyword>
          <Row>
            {data?.results.map((item, index) => (
              <Box
                whileHover={{ scale: 1.3 }}
                key={item.id}
                bgphoto={
                  item.backdrop_path ? makeImagePath(item.backdrop_path, 'w500') : NETFLIX_LOGO_URL
                }
              >
                <h1 style={{ color: 'blue' }}>{item.title}</h1>
              </Box>
            ))}
          </Row>
        </Wrapper>
      )}
    </>
  );
}

export default Search;
