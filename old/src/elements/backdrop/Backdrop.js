import ReactDOM from 'react-dom';

import css from './Backdrop.module.scss';

// ==============================================

const Backdrop = ({ show, hideHandler }) => {
  // --------------------------------------------

  const classes = `${css.backdrop} ${show ? '' : css.hide}`;

  // --------------------------------------------

  const backdrop = <div className={classes} onClick={hideHandler}></div>;
  // --------------------------------------------

  return ReactDOM.createPortal(
    backdrop,
    document.getElementById('backdrop-hook')
  );

  // --------------------------------------------
};

// ==============================================

export default Backdrop;
