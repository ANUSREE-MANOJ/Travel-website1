import React from 'react';
import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navigation from './pages/Auth/Navigation';
import Loader from './components/Loader'; // Import your Loader component
import { LoaderProvider, useLoader } from './components/LoaderContext'; // Import LoaderContext

const AppContent = () => {
  const { loading } = useLoader();

  return (
    <>
      {loading && <Loader />}
      <Navigation />
      <main className='py-3'>
        <Outlet />
      </main>
    </>
  );
};

function App() {
  return (
    <LoaderProvider>
      <ToastContainer />
      <AppContent />
    </LoaderProvider>
  );
}

export default App;
