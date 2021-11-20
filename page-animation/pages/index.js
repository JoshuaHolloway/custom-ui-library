import { useState, useEffect, useRef, useContext } from 'react';
import { gsap } from 'gsap';

import Page from '../components/page';

// ==============================================

export default function HomePage() {
  // --------------------------------------------

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // --------------------------------------------

  const page_ref = useRef([]); // access elements via ref.current[n]
  const tl_ref = useRef([]);

  const [animTrigger, setAnimTrigger] = useState(false);
  const [page, setPage] = useState(0);
  const [prev_page, setPrevPage] = useState();

  // --------------------------------------------

  const pageChangeHandler = (page_num) => () => {
    setPrevPage(page);
    setPage(page_num);
    setAnimTrigger((prev) => !prev);

    // Page 1:
    //  -0: 100%
    //  -1: 100%
    // Page N:
    //  -1: 200%
    //  -2: 100%

    tl_ref.current.push(
      gsap
        .timeline()
        .to(page_ref.current[page_num - 1], {
          duration: 1,
          xPercent: page_num == 1 ? 100 : 200,
        })
        .to(
          page_ref.current[page_num],
          {
            duration: 1,
            xPercent: 100,
          },
          '<'
        )
    );
  };

  const pageUnchangeHandler = () => tl_ref.current.pop()?.reverse();

  const setPageRef = (page_num) => (el) => (page_ref.current[page_num] = el);

  // --------------------------------------------

  return (
    <div
      style={{
        position: 'relative',
        border: 'solid green 10px',
        height: '100vh',
        width: '100vw',
        overflowX: 'hidden',
      }}
    >
      {/* page-0 */}

      <div
        ref={(el) => (page_ref.current[0] = el)}
        style={{
          background: 'hotpink',
          position: 'absolute',
          top: 0,
          left: '0',
          width: '100%',
          height: '100%',
        }}
      >
        <h1>Page 0</h1>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          fill='currentColor'
          viewBox='0 0 16 16'
          onClick={pageChangeHandler(1)}
        >
          <path
            fillRule='evenodd'
            d='M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z'
          />
        </svg>
      </div>

      {/* page-1 */}
      <Page
        page_num={1}
        pageChangeHandler={pageChangeHandler}
        pageUnchangeHandler={pageUnchangeHandler}
        setPageRef={setPageRef}
      />

      {/* page-2 */}
      <Page
        page_num={2}
        pageChangeHandler={pageChangeHandler}
        pageUnchangeHandler={pageUnchangeHandler}
        setPageRef={setPageRef}
      />

      {/* page-3 */}
      <Page
        page_num={3}
        last_page
        pageChangeHandler={pageChangeHandler}
        pageUnchangeHandler={pageUnchangeHandler}
        setPageRef={setPageRef}
      />
    </div>
  );
}
