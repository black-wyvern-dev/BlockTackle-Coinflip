import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from '../../components/Header';
import Modals from '../../components/Modals';

export default function DashboardLayout({ children }) {
  const [showModal, setShowModal] = useState(false);
  const [showInitial, setShowInitial] = useState(true);
  const location = useLocation();

  return (
    <div className={location.pathname === '/' ? 'main_page' : 'other_page'}>
      <Header showModal={() => setShowModal(true)} />
      {React.cloneElement(children)}
      {showModal && <Modals closeModal={() => setShowModal(false)} isInitial={false} />}
      {showInitial && <Modals closeModal={() => setShowInitial(false)} isInitial={true} />}
      <ToastContainer position="bottom-left" hideProgressBar={true} newestOnTop={true} />
    </div>
  );
}
