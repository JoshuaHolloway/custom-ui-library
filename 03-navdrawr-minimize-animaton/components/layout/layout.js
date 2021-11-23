import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import { elementGeometry } from '../../helpers/geometry';

import css from './layout.module.scss';

// ==============================================

const navbar_height = '90px';
const navdrawer_width = '25vw';
const minimized_navdrawer_width = '6vw';
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

  const [navdrawer_open, setNavDrawerOpen] = useState(true);
  const navdrawer_ref = useRef();
  const navdrawer_svg_max_ref = useRef();
  const navdrawer_svg_min_ref = useRef();
  const main_content_ref = useRef();
  const navdrawer_items_text_refs = useRef([]);
  const tl_ref = useRef();

  const navDrawerHandler = () => {
    //reusable function
    function removeElement(element) {
      return function () {
        element.parentNode.removeChild(element);
      };
    }

    if (navdrawer_open) {
      tl_ref.current = gsap
        .timeline()
        .to(navdrawer_items_text_refs.current, {
          duration: 0.3,
          opacity: 0,
          // onComplete: () => {
          //   navdrawer_items_text_refs.current.forEach((elem) => {
          //     elem.style.display = 'none';
          //   });
          // },
        })
        .to(
          navdrawer_ref.current,
          {
            duration: 0.5,
            width: minimized_navdrawer_width,
          },
          '<'
        )
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
      // navdrawer_items_text_refs.current.forEach((elem) => {
      //   elem.style.display = 'inline';
      // });
      tl_ref.current?.reverse();
    }

    setNavDrawerOpen((prev) => !prev);
  };

  // --------------------------------------------

  const navdrawer_items = [
    {
      svg_path: (
        <path d='M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z' />
      ),
      title: 'Users',
    },
    {
      svg_path: (
        <path d='M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z' />
      ),
      title: 'Orders',
    },
    {
      svg_path: (
        <path d='M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z' />
      ),
      title: 'Products',
    },
    {
      svg_path: (
        <path d='M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zM4 15h3v-5H4v5zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3zm3 0h-2v3h2v-3z' />
      ),
      title: 'Store',
    },
  ];

  return (
    <div style={{ position: 'relative' }}>
      <nav
        id='main-navdrawer'
        className={css.main_navdrawer}
        ref={navdrawer_ref}
        style={{
          position: 'fixed',
          top: navbar_height,
          width: navdrawer_width,
          height: '100%',
          paddingTop: navbar_height,
        }}
      >
        <div
          id='navdrawer-minimize-button'
          className={css.navdrawer_minmax_button}
          onClick={navDrawerHandler}
        >
          <svg
            ref={navdrawer_svg_min_ref}
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            fill='currentColor'
            className='bi bi-chevron-left'
            viewBox='0 0 16 16'
          >
            <path
              fillRule='evenodd'
              d='M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z'
            />
          </svg>
        </div>

        <div
          id='navdrawer-maximize-button'
          className={css.navdrawer_minmax_button}
          onClick={navDrawerHandler}
        >
          {' '}
          <svg
            ref={navdrawer_svg_max_ref}
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            fill='currentColor'
            className='bi bi-chevron-right'
            viewBox='0 0 16 16'
            style={{ opacity: 0 }}
          >
            <path
              fillRule='evenodd'
              d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z'
            />
          </svg>
        </div>

        <div id='navdrawer-navitems-container'>
          <div
            id='navdrawer-navitems'
            style={{
              display: 'grid',
              gridTemplateRows: 'repeat(4, 45px)',
              gridTemplateColumns: `1fr`,
              gap: '20px',
              // alignItems: 'center',
              minWidth: minimized_navdrawer_width,
            }}
          >
            {navdrawer_items.map((navdrawer_item, idx) => {
              return (
                <div
                  key={idx}
                  style={{
                    display: 'grid',
                    gridTemplateRows: 'repeat(1, 100%)',
                    gridTemplateColumns: `${minimized_navdrawer_width} 1fr`,
                    alignItems: 'center',
                    minWidth: minimized_navdrawer_width,
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      // background: 'rgba(255, 0, 0, 0.25)',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg
                      className={css.navdrawer_item}
                      xmlns='http://www.w3.org/2000/svg'
                      width='26'
                      height='26'
                      fill='currentColor'
                      viewBox='0 0 16 16'
                    >
                      {navdrawer_item.svg_path}
                    </svg>
                  </div>
                  <span
                    ref={(el) => (navdrawer_items_text_refs.current[idx] = el)}
                    className={css.navdrawer_item}
                  >
                    {navdrawer_item.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <hr className={css.nav_drawer_hr} />
      </nav>

      <nav
        id='main-navbar'
        className={css.main_navbar}
        style={{
          position: 'fixed',
          height: navbar_height,
          width: '100%',
        }}
      ></nav>

      <main
        id='main-content'
        className={css.main_content}
        ref={main_content_ref}
        style={{
          position: 'fixed',
          top: navbar_height,
          left: navdrawer_width,
          height: `calc(100vh - ${navbar_height})`,
          width: `calc(100% - ${navdrawer_width})`,

          border: 'solid hotpink 5px',
          background: 'red',
        }}
      >
        {children}
      </main>
    </div>
  );
}
