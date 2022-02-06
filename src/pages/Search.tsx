import { AnimatePresence, motion, Variants } from 'framer-motion';
import { Item } from 'framer-motion/types/components/Reorder/Item';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { searchMovieAndTVShow } from '../api/search';
import { makeImagePath } from '../utils/movie';
import { NETFLIX_LOGO_URL } from './Home';

const Wrapper = styled.div`
  padding: 100px 20px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  row-gap: 40px;
  width: 100%;

  @media (min-width: 780px) {
    grid-template-columns: repeat(6, 1fr);
  }

  @media (max-width: 780px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Box = styled(motion.div)<{ bgphoto?: string }>`
  cursor: pointer;

  @media (min-width: 780px) {
    /* 가장 오른쪽 아이템  */
    &:nth-child(6n) {
      transform-origin: center right;
    }

    /* 가장 왼쪽 아이템 */
    &:nth-child(6n + 1) {
      transform-origin: center left;
    }
  }

  @media (max-width: 780px) {
    /* 가장 오른쪽 아이템  */
    &:nth-child(3n) {
      transform-origin: center right;
    }

    /* 가장 왼쪽 아이템 */
    &:nth-child(3n + 1) {
      transform-origin: center left;
    }
  }
`;

const Poster = styled.div<{ bgphoto: string }>`
  background-color: #741414;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
`;

const Info = styled(motion.div)`
  width: 100%;
  padding: 10px;
  background-color: ${(props) => props.theme.black.darker};
  opacity: 0;

  h4 {
    text-align: center;
    font-size: 0.8rem;
  }
`;

const SearchKeyword = styled.h2`
  font-weight: 600;
  font-size: 28px;
  margin-bottom: 40px;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  background-color: rgba(0, 0, 0, 1);
  top: 0; //? 임시 위치 (커서의 위치에 따라 바꿀 예정)
  width: 40vw;
  height: 80vh;

  left: 0;
  right: 0;
  margin: 0 auto;
`;

const BigCover = styled.div<{ bgImage?: string }>`
  background-image: linear-gradient(to top, black, transparent), url(${(props) => props.bgImage});
  background-size: cover;
  background-position: center center;
  /* background-color: blueviolet; */
  width: 100%;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-weight: 600;
  font-size: 46px;
  padding: 20px;
  top: -80px;
  position: relative;
`;

const BigOverview = styled.p`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  top: -80px;
`;

const boxVariants: Variants = {
  normal: {
    scale: 1,
  },
  hover: {
    y: -80,
    scale: 1.3,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: 'tween',
    },
  },
};

const infoVariants: Variants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: 'tween',
    },
  },
};

/**
 * 검색 페이지
 * @returns
 */
function Search() {
  const location = useLocation();
  const navigate = useNavigate();

  const BigMovieMatch = useMatch('/search/:movieId');

  const [page, setPage] = useState(1);
  const keyword = new URLSearchParams(location.search).get('keyword');

  const { data, isLoading } = useQuery(['search', keyword, page], () =>
    searchMovieAndTVShow(keyword || '', page)
  );

  /**
   * 현재 클릭한 영화 정보 데이터
   */
  const clickedMovie =
    BigMovieMatch?.params.movieId &&
    data?.results.find((movie) => movie.id === +BigMovieMatch.params.movieId!);

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
                key={item.id}
                onClick={() => navigate(`/search/${item.id}?keyword=${keyword}`)}
                layoutId={String(item.id)}
                variants={boxVariants}
                initial="normal"
                whileHover="hover"
                transition={{ type: 'tween' }}
              >
                <Poster
                  bgphoto={
                    item.backdrop_path
                      ? makeImagePath(item.backdrop_path, 'w500')
                      : NETFLIX_LOGO_URL
                  }
                />
                <Info variants={infoVariants}>
                  <h4>{item.title || item.name}</h4>
                </Info>
              </Box>
            ))}
          </Row>

          <AnimatePresence>
            {BigMovieMatch && (
              <>
                <Overlay
                  onClick={() => navigate(`/search?keyword=${keyword}`)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />

                <BigMovie layoutId={BigMovieMatch.params.movieId}>
                  {clickedMovie && (
                    <>
                      <BigCover
                        bgImage={
                          clickedMovie.backdrop_path
                            ? makeImagePath(clickedMovie.backdrop_path, 'w500')
                            : NETFLIX_LOGO_URL
                        }
                      />
                      <BigTitle>{clickedMovie.title || clickedMovie.name}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            )}
          </AnimatePresence>
        </Wrapper>
      )}
    </>
  );
}

export default Search;
