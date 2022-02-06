import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from '../components/Header';
import Home from '../pages/Home';
import Search from '../pages/Search';
import Tv from '../pages/Tv';

function MainRouter() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies/:movieId" element={<Home />} />
        <Route path="/tv" element={<Tv />} />
        <Route path="/search" element={<Search />} />
        <Route path="/search/:movieId" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}

export default MainRouter;
