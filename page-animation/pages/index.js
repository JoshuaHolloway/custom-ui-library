import { useState, useEffect, useRef, useContext } from 'react';
import { gsap } from 'gsap';

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

  useEffect(() => {
    console.log('prev_page: ', prev_page, '\tpage: ', page);

    if (mounted) {
      if (prev_page < page) {
        tl_ref.current.push(
          gsap
            .timeline()
            .to(page_ref.current[page - 1], {
              duration: 0.5,
              xPercent: 100,
            })
            .to(
              page_ref.current[page],
              {
                duration: 0.5,
                xPercent: 100,
              },
              '<'
            )
        );
      } else {
        tl_ref.current.pop()?.reverse();
      }
    }
  }, [animTrigger]);

  // --------------------------------------------

  const pageChangeHandler = (page_num) => () => {
    setPrevPage(page);
    setPage(page_num);
    setAnimTrigger((prev) => !prev);
  };

  // --------------------------------------------

  return (
    <div
      style={{
        position: 'relative',
        border: 'solid green 2px',
        height: '100vh',
        overflowX: 'hidden',
      }}
    >
      {/* page-1 */}
      <div
        ref={(el) => (page_ref.current[0] = el)}
        style={{ background: 'hotpink' }}
      >
        <h1>Page 1</h1>
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

      {/* page-2 */}
      <div
        ref={(el) => (page_ref.current[1] = el)}
        style={{
          background: 'deepskyblue',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
        }}
      >
        <h1>Page 2</h1>

        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          fill='currentColor'
          viewBox='0 0 16 16'
          onClick={pageChangeHandler(0)}
        >
          <path
            fillRule='evenodd'
            d='M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z'
          />
        </svg>

        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          fill='currentColor'
          viewBox='0 0 16 16'
          onClick={pageChangeHandler(2)}
        >
          <path
            fillRule='evenodd'
            d='M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z'
          />
        </svg>
      </div>

      {/* page-3 */}
      <div
        ref={(el) => (page_ref.current[2] = el)}
        style={{
          background: 'darkorchid',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
        }}
      >
        <h1>Page 3</h1>

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
            d='M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z'
          />
        </svg>

        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          fill='currentColor'
          viewBox='0 0 16 16'
          onClick={pageChangeHandler(3)}
        >
          <path
            fillRule='evenodd'
            d='M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z'
          />
        </svg>
      </div>

      {/* page-4 */}
      <div
        ref={(el) => (page_ref.current[3] = el)}
        style={{
          background: 'darkorange',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
        }}
      >
        <h1>Page 4</h1>

        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          fill='currentColor'
          viewBox='0 0 16 16'
          onClick={pageChangeHandler(2)}
        >
          <path
            fillRule='evenodd'
            d='M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z'
          />
        </svg>
      </div>
    </div>
  );
}
