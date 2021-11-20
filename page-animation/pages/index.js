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

  // --------------------------------------------

  const pageChangeHandler = (page_num) => () => {
    // Page 1:
    //  -0:   100%
    //  -1:   100%
    // Page N:
    //  -N-1: 200%
    //  -N:   100%

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
      <Page
        page_num={0}
        pageChangeHandler={pageChangeHandler}
        pageUnchangeHandler={pageUnchangeHandler}
        setPageRef={setPageRef}
      />

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
