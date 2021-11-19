import { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';

import { gsap } from 'gsap';

import Backdrop from '../backdrop/Backdrop';

import css from './Modal.module.scss';

// ==============================================

const Modal = ({ show, hideHandler, blur_ref }) => {
  // --------------------------------------------

  const [isInitRender, setIsInitRender] = useState(true);
  const [animationReverseComplete, setAnimationReverseComplete] =
    useState(true);
  const [cssClassList, setCssClassList] = useState(css.modal);

  // --------------------------------------------

  const modal_ref = useRef();
  const tl = useRef();

  // --------------------------------------------

  useEffect(() => {
    if (show === true && isInitRender === false) {
      setCssClassList(css.modal);

      const duration = 0.5;

      // gsap.to(blur_ref.current, config);
      tl.current = gsap
        .timeline()
        .to(blur_ref.current, {
          duration,
          background: 'rgba(0, 0, 255, 0.75)',
          filter: 'blur(3px)',
        })
        .to(
          modal_ref.current,
          {
            duration,
            opacity: 1,
            onReverseComplete: () => {
              setCssClassList(`${css.modal} ${css.hide}`);
            },
          },
          '<'
        );
    } else if (show === false && isInitRender === false) {
      if (tl) {
        tl.current.reverse();
      }
    }

    setIsInitRender(false);
  }, [show]);

  // --------------------------------------------

  const modal = (
    <>
      <Backdrop show={show} hideHandler={hideHandler} />

      <div ref={modal_ref} className={cssClassList}>
        Modal
        <svg
          onClick={hideHandler}
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          fill='currentColor'
          viewBox='0 0 16 16'
        >
          <path d='M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z' />
          <path d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z' />
        </svg>
      </div>
    </>
  );
  // --------------------------------------------

  return ReactDOM.createPortal(modal, document.getElementById('modal-hook'));

  // --------------------------------------------
};

// ==============================================

export default Modal;
