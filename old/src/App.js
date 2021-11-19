import { useState, useEffect, useRef } from 'react';

import Modal from './elements/modal/Modal';
import Navdrawer from './elements/navdrawer/Navdrawer';

import i from './lena-2.jpg';
import './App.scss';

// ==============================================

function App() {
  // --------------------------------------------

  const blur_ref = useRef();

  // --------------------------------------------

  const [showModal, setShowModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  // --------------------------------------------

  const showModalHandler = () => setShowModal(true);
  const hideModalHandler = () => setShowModal(false);

  const showDrawerHandler = () => setShowDrawer(true);
  const hideDrawerHandler = () => setShowDrawer(false);

  // --------------------------------------------

  return (
    <>
      <Modal
        show={showModal}
        hideHandler={hideModalHandler}
        blur_ref={blur_ref}
      />
      <Navdrawer
        show={showDrawer}
        hideHandler={hideDrawerHandler}
        blur_ref={blur_ref}
      />

      <div ref={blur_ref} className='blur-container'>
        <button onClick={showModalHandler}>Modal</button>
        Show Modal: {showModal ? 'show' : 'hide'}
        <button onClick={showDrawerHandler}>Drawer</button>
        Show Drawer: {showDrawer ? 'show' : 'hide'}
        <img src={i} width='80%' alt='' />
      </div>
    </>
  );
}

// ==============================================

export default App;
