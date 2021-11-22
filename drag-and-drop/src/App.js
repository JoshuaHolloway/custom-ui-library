// import { useState } from 'react';
import { useSpring, animated } from 'react-spring';

import { useDrag } from 'react-use-gesture';

import logo from './logo.svg';
// import img from './img/zoltan-tasi-eEMjPGfXAwg-unsplash.jpg';
import './App.css';

const SCREEN_HEIGHT = window.innerHeight - 30;

// ==============================================

function App() {
  // --------------------------------------------

  // const [logoPos, setLogoPos] = useState({ x: 100, y: 0 });
  const logoPos = useSpring({ x: 0, y: 0 });
  const bindLogoPos = useDrag((params) => {
    // setLogoPos({
    //   x: params.offset[0],
    //   y: params.offset[1],
    // });

    logoPos.x.set(params.offset[0]);

    const y = params.xy[1];
    if (params.dragging) {
      if (y >= 0 && y < SCREEN_HEIGHT) {
        logoPos.y.set(params.offset[1]);
      }
    } else {
      if (y > SCREEN_HEIGHT / 2) {
        // logoPos.y.set(y);
        logoPos.y.start(y); // snap
      } else {
        // top half
        // logoPos.y.set(0);
        logoPos.y.start(0); // snap
      }
    }
  });

  // --------------------------------------------
  return (
    <div className='App'>
      <animated.div
        style={{
          y: logoPos.y,
          opacity: logoPos.y.to([0, SCREEN_HEIGHT], [1, 0.5]),
        }}
      >
        <div className='App-overlay' />
      </animated.div>
      <div className='App-bg' />

      <header className='App-header' style={{ border: 'solid red 10px' }}>
        {/* <div
          {...bindLogoPos()}
          style={{ position: 'relative', top: logoPos.y, left: logoPos.x }}
        > */}
        <animated.div {...bindLogoPos()} style={{ y: logoPos.y, x: logoPos.x }}>
          <img src={logo} className='App-logo' alt='logo' />
        </animated.div>
      </header>
    </div>
  );

  // --------------------------------------------
}

// ==============================================

export default App;
