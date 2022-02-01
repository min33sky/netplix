import { useQuery } from 'react-query';
import styled from 'styled-components';
import { getMovies } from '../api/movie';
import { makeImagePath } from '../utils/movie';
import { AnimatePresence, motion, useViewportScroll, Variants } from 'framer-motion';
import { useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  background-color: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgImage: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgImage});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  width: 100%;
  position: absolute;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: #741414;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  cursor: pointer;

  /* 첫 번째, 마지막 아이템의 애니메이션이 짤리지 않게 설정 */
  &:first-child {
    transform-origin: center left;
  }

  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;

  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  background-color: rgba(0, 0, 0, 1);
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

const rowVariants: Variants = {
  //? custom Prop을 이용해 현재 브라우저의 너비를 받아온다.
  hidden: (width: number) => ({
    x: width + 5,
    opacity: 0,
  }),
  visible: {
    x: 0,
    opacity: 1,
  },
  exit: (width: number) => ({
    x: -width - 5,
    opacity: 0,
  }),
};

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
 * 슬라이더에 보여질 아이템의 개수
 */
const SLIDER_OFFSET = 6;

/**
 * 포스터 이미지가 없을 경우 사용할 이미지 주소
 */
export const NETFLIX_LOGO_URL =
  'https://assets.brand.microsites.netflix.io/assets/2800a67c-4252-11ec-a9ce-066b49664af6_cm_800w.jpg?v=4';

/**
 * 메인 페이지
 * @returns
 */
function Home() {
  const { data, isLoading } = useQuery(['movies', 'nowPlaying'], getMovies);

  const navigate = useNavigate();
  const bigMovieMatch = useMatch('/movies/:movieId');

  const { scrollY } = useViewportScroll();

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const increaseIndex = () => {
    if (data) {
      // ? 최대 한 Row만 변경 되도록 설정 (더블 클릭 방지)
      if (leaving) return;
      toggleLeaving();

      const totalMovies = data.results.length - 1; // 첫번째 영화는 메인 화면이므로 제외
      const maxIndex = Math.floor(totalMovies / SLIDER_OFFSET) - 1; // 0부터 시작이므로 1을 뺀다.
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  //? 컴포넌트의 애니메이션이 종료되었을 때 호출되는 핸들러
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const onBoxClicked = (movieId: string) => navigate(`/movies/${movieId}`);
  const onOverlayClicked = () => navigate('/');
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId!);

  return (
    <>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <Wrapper>
          <Banner
            onClick={increaseIndex}
            bgImage={makeImagePath(data?.results[0].backdrop_path || '')}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>

          <Slider>
            {/* initial을 false로 설정해서 제일 처음 initial 애니메이션 사용 ㄴㄴ */}
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                key={index}
                custom={window.innerWidth}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                transition={{
                  type: 'tween',
                  duration: 1,
                }}
                exit="exit"
              >
                {data?.results
                  .slice(1)
                  .slice(SLIDER_OFFSET * index, SLIDER_OFFSET * index + SLIDER_OFFSET)
                  .map((movie) => (
                    <Box
                      key={movie.id}
                      layoutId={String(movie.id)}
                      onClick={() => onBoxClicked(String(movie.id))}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: 'tween' }}
                      bgphoto={
                        movie.backdrop_path
                          ? makeImagePath(movie.backdrop_path, 'w500')
                          : NETFLIX_LOGO_URL
                      }
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>

          {/* 영화 상세 정보 모달 */}
          <AnimatePresence>
            {bigMovieMatch && (
              <>
                <Overlay
                  onClick={onOverlayClicked}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie
                  layoutId={bigMovieMatch.params.movieId}
                  style={{
                    top: scrollY.get() + 100,
                  }}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        bgImage={
                          clickedMovie.backdrop_path
                            ? makeImagePath(clickedMovie.backdrop_path, 'w500')
                            : NETFLIX_LOGO_URL
                        }
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
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

export default Home;
