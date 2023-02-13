import React, { useState } from 'react';
import ReactGA from 'react-ga';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from '../../components/Header';
import Modals from '../../components/Modals';

export default function DashboardLayout({ children }) {
  const [showModal, setShowModal] = useState(false);
  const [showInitial, setShowInitial] = useState(true);
  const [_openedTime, setOpenedTime] = useState(Date.now());

  const location = useLocation();

  const handleFaqOpenClicked = () => {
    setOpenedTime(Date.now());
    setShowModal(true);
  };

  const handleFaqCloseClicked = () => {
    setOpenedTime((oldDate) => {
      gaTriggerStayTiming(Date.now() - oldDate);
    });
    setShowModal(false);
  };

  function gaTriggerStayTiming(duration) {
    ReactGA.timing({
      category: 'Time Measurement',
      variable: 'spentTime',
      value: duration, // in milliseconds
      label: 'Stay at faq'
    });
  }

  return (
    <div className={location.pathname === '/' ? 'main_page' : 'other_page'}>
      <Header showModal={handleFaqOpenClicked} />
      {React.cloneElement(children)}
      {showModal && <Modals closeModal={handleFaqCloseClicked} isInitial={false} />}
      {showInitial && <Modals closeModal={() => setShowInitial(false)} isInitial={true} />}
      <ToastContainer position="bottom-left" hideProgressBar={true} newestOnTop={true} />
    </div>
  );
}
