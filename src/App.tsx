import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import CharactersPage from './pages/Characters';
import Details from './pages/Details';
import RecoidContextProvider from './recoilProvider';
import Locations from './pages/Locations';
import LocationCharacters from './pages/LocationCharacters';
import { ToastContainer } from 'react-toastify';

function AppRouter() {
  return (
    <>
      <ToastContainer />
      <RecoidContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<CharactersPage />} />
            <Route path="/details/:id" element={<Details />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/locations/:name" element={<LocationCharacters />} />
          </Routes>
        </Router>
      </RecoidContextProvider>
    </>
  );
}

export default AppRouter;
