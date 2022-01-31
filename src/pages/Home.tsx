import { useQuery } from 'react-query';
import styled from 'styled-components';
import { getMovies } from '../api/movie';
import { makeImagePath } from '../utils/movie';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { useState } from 'react';

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

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
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

/**
 * 슬라이더에 보여질 아이템의 개수
 */
const SLIDER_OFFSET = 6;

/**
 * 메인 페이지
 * @returns
 */
function Home() {
  const { data, isLoading } = useQuery(['movies', 'nowPlaying'], getMovies);

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

  return (
    <Wrapper>
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
                      bgPhoto={makeImagePath(movie.backdrop_path || '', 'w500')}
                    />
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </Wrapper>
      )}
    </Wrapper>
  );
}

export default Home;
