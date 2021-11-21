import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import { elementGeometry } from '../../helpers/geometry';

// ==============================================

const navbar_height = '75px';
const navdrawer_width = '25vw';
const minimized_navdrawer_width = '5vw';
// const main_content_shift =

// const extractNum = (str) => 'josh12x'.match(/\d+/)[0];
const extractNum = (str) => str.match(/\d+/)[0];

// ==============================================

export default function Layout({ children }) {
  // --------------------------------------------

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const [navdrawer_open, setNavDrawerOpen] = useState(false);
  const navdrawer_ref = useRef();
  const navdrawer_svg_max_ref = useRef();
  const navdrawer_svg_min_ref = useRef();
  const main_content_ref = useRef();
  const tl_ref = useRef();

  const navDrawerHandler = () => {
    setNavDrawerOpen((prev) => !prev);
  };

  useEffect(() => {
    if (mounted) {
      if (navdrawer_open) {
        tl_ref.current = gsap
          .timeline()
          .to(navdrawer_ref.current, {
            duration: 0.5,
            width: minimized_navdrawer_width,
          })
          .to(
            main_content_ref.current,
            {
              duration: 0.5,
              width: `calc(100% - ${minimized_navdrawer_width})`,
              x: `-${
                extractNum(navdrawer_width) -
                extractNum(minimized_navdrawer_width)
              }vw`,
            },
            '<'
          )
          .to(
            navdrawer_svg_min_ref.current,
            {
              opacity: 0,
            },
            '<'
          )
          .to(
            navdrawer_svg_max_ref.current,
            {
              opacity: 1,
            },
            '<'
          );
      } else {
        tl_ref.current?.reverse();
      }
    }
  }, [navdrawer_open]);

  // --------------------------------------------

  return (
    <div style={{ position: 'relative' }}>
      <nav
        id='main-navdrawer'
        ref={navdrawer_ref}
        style={{
          position: 'fixed',
          top: navbar_height,
          width: navdrawer_width,
          height: '100%',
          paddingTop: navbar_height,
          background: 'green',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '1em',
            right: '1em',
            border: 'solid black 2px',
            borderRadius: '3px',
            padding: '3px',
            display: 'grid',
            placeItems: 'center',
          }}
          onClick={navDrawerHandler}
        >
          <svg
            ref={navdrawer_svg_min_ref}
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            fill='currentColor'
            viewBox='0 0 16 16'
          >
            <path d='M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5zM0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zm10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4z' />
          </svg>
        </div>

        <div
          style={{
            position: 'absolute',
            top: '1em',
            right: '1em',
            border: 'solid black 2px',
            borderRadius: '3px',
            padding: '3px',
            display: 'grid',
            placeItems: 'center',
          }}
          onClick={navDrawerHandler}
        >
          {' '}
          <svg
            ref={navdrawer_svg_max_ref}
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            fill='currentColor'
            viewBox='0 0 16 16'
            style={{ opacity: 0 }}
          >
            <path d='M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z' />
          </svg>
        </div>
      </nav>

      <nav
        id='main-navbar'
        style={{
          position: 'fixed',
          height: navbar_height,
          width: '100%',
          background: 'blue',
        }}
      ></nav>

      <main
        id='main-content'
        ref={main_content_ref}
        style={{
          position: 'fixed',
          top: navbar_height,
          left: navdrawer_width,
          height: `calc(100vh - ${navbar_height})`,
          width: `calc(100% - ${navdrawer_width})`,
          overflowY: 'scroll',
          // paddingLeft: navdrawer_width,
          border: 'solid hotpink 5px',
        }}
      >
        {children}
      </main>
    </div>
  );
}
