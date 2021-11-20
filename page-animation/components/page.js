export default function Page({
  page_num,
  pageChangeHandler,
  pageUnchangeHandler,
  setPageRef,
  last_page,
}) {
  const color_map = ['hotpink', 'deepskyblue', 'darkorchid', 'darkorange'];

  return (
    <div
      ref={setPageRef(page_num)}
      style={{
        background: color_map[page_num],
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <div className='container'>
        <h1>Page {page_num}</h1>

        {page_num > 0 && (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='32'
            height='32'
            fill='currentColor'
            viewBox='0 0 16 16'
            onClick={pageUnchangeHandler}
          >
            <path
              fillRule='evenodd'
              d='M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z'
            />
          </svg>
        )}
        {!last_page && (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='32'
            height='32'
            fill='currentColor'
            viewBox='0 0 16 16'
            onClick={pageChangeHandler(page_num + 1)}
          >
            <path
              fillRule='evenodd'
              d='M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z'
            />
          </svg>
        )}
      </div>
    </div>
  );
}
