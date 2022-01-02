import { useState, useEffect, useRef } from 'react';
import './App.css';
import { getMonthInfo } from './date';
// import { ROWS, COLS } from './constants';

// ==============================================

export default function App() {
  // --------------------------------------------

  // const [hover_index, setHoverIndex] = useState();

  const prev_ref = useRef();

  // --------------------------------------------

  const [date_range_0, setDateRange0] = useState(); // {year: y, month: m, date: d, idx, jdx}: {year: number, month: number, date: number, idx: number, jdx: number, lin_index: number}
  const [date_range_1, setDateRange1] = useState();

  const [month, setMonth] = useState();
  const [year, setYear] = useState();

  const [days_in_month, setDaysInMonth] = useState();
  const [first_day, setFirstDay] = useState(); // first_day: number

  const indices2day = (idx, jdx) => {
    // 7 = num-days-in-week === num elements in each row
    const lin_index = idx * 7 + jdx;
    const d = lin_index - first_day + 1;
    // -days are 1-based
    // -this indexing is zero-based
    // -adjust by adding 1
    // -without the +1 the first day of the month is labeld as zero

    const is_valid = 0 < d && d <= days_in_month;
    return { is_valid, lin_index, d };
  };

  useEffect(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth();

    setMonth(m);
    setYear(y);

    const { days_in_month: d_in_m, first_day: f_d } = getMonthInfo(y, m);

    setDaysInMonth(d_in_m);
    setFirstDay(f_d);
  }, []);

  // --------------------------------------------

  const resetDateRange = () => {
    setClickNum(null);
    setIdxState0(null);
    setJdxState0(null);
    setIdxState1(null);
    setJdxState1(null);
  };

  // --------------------------------------------

  const [click_num, setClickNum] = useState(null);
  const handleClickNum = () =>
    setClickNum((prev) => {
      if (click_num) {
        return (prev + 1) % 2;
      } else {
        // -used to distinguish the very first click from the other ones (before first click_num is null)
        // -specifically used for the hover
        //  --We want the hover to work before any clicks.
        //  --But after that we only want it to work between first and second clicks.
        return 1; // first-click
      }
    });
  const [idx_state_0, setIdxState0] = useState();
  const [jdx_state_0, setJdxState0] = useState();
  const [idx_state_1, setIdxState1] = useState();
  const [jdx_state_1, setJdxState1] = useState();

  const start_or_end = (idx, jdx) => {
    if (
      idx === idx_state_0 &&
      jdx === jdx_state_0 &&
      idx === idx_state_1 &&
      jdx === jdx_state_1 &&
      click_num === 0
    ) {
      // -Case 3: Date range is single day
      return 'start-and-end';
    } else if (idx === idx_state_0 && jdx === jdx_state_0) {
      // -Case 1: Start of date range
      return 'start';
    } else if (idx === idx_state_1 && jdx === jdx_state_1 && click_num !== 1) {
      // -Case 2: End of date range
      return 'end';
    }
  };

  // --------------------------------------------

  // -Layer 0: Click input handling logic
  const CalendarLayer0 = () => {
    // - - - - - - - - - - - - - - - - - - - - -
    const clickHandler = (idx, jdx) => (e) => {
      // console.log(`idx: ${idx}\tjdx: ${jdx}`);

      // const lin_index = idx * 7 + jdx;
      // const d = lin_index - first_day + 1;
      const { d, lin_index } = indices2day(idx, jdx);

      if (click_num === 0 || !click_num) {
        // -1st date-range click
        // -1st click (click_num===null) and odd number clicks
        setIdxState0(idx);
        setJdxState0(jdx);

        // -Click handlers are applied only to valid region.
        //  => We can just store the date without checking validity.
        setDateRange0({ year, month, date: d, idx, jdx, lin_index });
      } else if (click_num === 1) {
        // -Second date-range click
        if (date_range_0.date <= d) {
          // -standard case (date-1 <= date-2)

          setIdxState1(idx);
          setJdxState1(jdx);

          // -Click handlers are applied only to valid region.
          //  => We can just store the date without checking validity.
          setDateRange1({ year, month, date: d, idx, jdx, lin_index });
        } else {
          // -backward case (date-1 > date-2)

          // -step 1: set click-2 state to click-1
          setIdxState1(date_range_0.idx);
          setJdxState1(date_range_0.jdx);
          setDateRange1({ ...date_range_0 });

          // -step 2: set date_range_0 to current values
          setIdxState0(idx);
          setJdxState0(jdx);
          setDateRange0({ year, month, date: d, idx, jdx, lin_index });
        }
      }
      handleClickNum();
    };

    // - - - - - - - - - - - - - - - - - - - - -

    // -Draw date range borders
    const getClasses = (idx, jdx) => {
      let on_or_off = false; // true -> on, false -> off
      if (click_num === 0 || !click_num) {
        // -1st click and odd number clicks (click_num===null before first click)
        if (idx_state_0 === idx_state_1) {
          // -Case 1: same row
          on_or_off =
            idx_state_0 <= idx &&
            idx <= idx_state_1 &&
            jdx_state_0 <= jdx &&
            jdx <= jdx_state_1;
        } else if (Math.abs(idx_state_0 - idx_state_1) === 1) {
          // Case 2: adjacent rows
          if (idx_state_0 === idx && jdx_state_0 <= jdx) {
            // -Starting row
            // -turn on row from first click to end of row
            on_or_off = true;
          } else if (idx_state_1 === idx && jdx <= jdx_state_1) {
            // -Ending row
            // -turn of row from starting of row to second click
            on_or_off = true;
          }
        } else {
          // Case 3: start row and end row are more than one row appart
          if (idx_state_0 === idx && jdx_state_0 <= jdx) {
            // -Starting row
            // -turn on row from first click to end of row
            on_or_off = true;
          } else if (idx_state_1 === idx && jdx <= jdx_state_1) {
            // -Ending row
            // -turn of row from starting of row to second click
            on_or_off = true;
          } else if (idx_state_0 < idx && idx < idx_state_1) {
            // -Middle rows
            // -turn on all middle row elements
            on_or_off = true;
          }
        }
      } else {
        on_or_off = false;
      }

      let classes;
      if (start_or_end(idx, jdx) === 'start') {
        // left of starting click (round on left side)
        classes = 'col on on-start';
      } else if (start_or_end(idx, jdx) === 'end') {
        classes = 'col on on-end';
      } else if (start_or_end(idx, jdx) === 'start-and-end') {
        classes = `col on-start-and-end`;
        console.log('start and end');
      } else if (on_or_off === true && click_num !== null) {
        classes = `col ${on_or_off ? 'on' : 'off'} on-middle`;
      } else {
        classes = `col off`;
      }
      return classes;
    };

    // - - - - - - - - - - - - - - - - - - - - -

    const [region_state, setRegionState] = useState();
    useEffect(() => {
      if (click_num === 1) {
        // -Flip the start style with the end style
        //  if the hover index is less than the
        //  first date index:

        if (region_state === 2) {
          console.log('region 2');
          // -Same day case (date_0 === date_1)
          prev_ref.current.classList.remove('on-start');
          prev_ref.current.classList.remove('on-end');
          prev_ref.current.classList.add('on-start-and-end');
        } else if (region_state === 0) {
          console.log('region 0');
          // -Standard case
          // prev_ref.current.classList.replace('on-end', 'on-start');
          prev_ref.current.classList.remove('on-start-and-end');
          prev_ref.current.classList.remove('on-end');
          prev_ref.current.classList.add('on-start');
        } else if (region_state === 1) {
          console.log('region 1');
          // -Reverse case (date_0 > date_1)
          // prev_ref.current.classList.replace('on-start', 'on-end');
          prev_ref.current.classList.remove('on-start-and-end');
          prev_ref.current.classList.remove('on-start');
          prev_ref.current.classList.add('on-end');
        }
      }
    }, [region_state]);

    // - - - - - - - - - - - - - - - - - - - - -

    const [hover_classes, setHoverClasses] = useState(new Array(7 * 7));
    const [hover_index, setHoverIndex] = useState();

    useEffect(() => {
      if (click_num === 1) {
        // -Light up currently hovered:
        const hover_classes_copy = [...hover_classes];
        // hover_classes_copy[hover_index] = 'col fuck';
        // setHoverClasses(hover_classes_copy);

        for (let i = 0; i < hover_classes.length; ++i) {
          if (date_range_0.lin_index <= hover_index) {
            // -Regular case (date_0 <= date_1 [hover])
            if (date_range_0.lin_index <= i && i <= hover_index) {
              hover_classes_copy[i] = 'col fuck';
            } else {
              hover_classes_copy[i] = 'col';
            }
          } else {
            // -Backwards case (date_0 > date_1)
            if (hover_index <= i && i <= date_range_0.lin_index) {
              hover_classes_copy[i] = 'col fuck';
            } else {
              hover_classes_copy[i] = 'col';
            }
          }
        }
        setHoverClasses(hover_classes_copy);
      }
    }, [hover_index]);

    // - - - - - - - - - - - - - - - - - - - - -

    const Row = ({ children }) => <div className='row'>{children}</div>;
    const Col = ({ idx, jdx }) => {
      const { d, lin_index, is_valid } = indices2day(idx, jdx);

      const callback = is_valid ? clickHandler(idx, jdx) : () => {};

      // const [hover, setHover] = useState(false);

      // Region 0: date_0 < date_1 (hover)  -  Regular
      // Region 1: date_0 > date_1 (hover)  -  Backward
      // Region 2: date_0 = date_1 (hover)  -  Same day

      // const classes = getClasses(idx, jdx);

      return (
        <div
          onClick={callback}
          onMouseEnter={() => {
            // const { lin_index } = indices2day(idx, jdx);

            if (click_num !== 0 && is_valid) {
              // -Three click_num states:
              //  --null. Before first click
              //  --1.    After first (and odd-numbered) click(s)
              //  --0.    After second (and even-numbered) click(s)
              // setHover(true);
              const hover_classes_copy = [...hover_classes];
              hover_classes_copy[lin_index] = getClasses(idx, jdx);
              // setHoverClasses(hover_classes_copy);

              setHoverIndex(lin_index);
            }

            // -Don't need region state
            // -Instead, can simply use the hover_index state
            //  to infer the region the lin_index is located in.
            if (lin_index === date_range_0?.lin_index) {
              setRegionState(2);
            } else if (date_range_0?.lin_index < lin_index) {
              setRegionState(0);
            } else if (lin_index < date_range_0?.lin_index) {
              setRegionState(1);
            }
          }}
          onMouseLeave={() => {
            // setHover(false);
          }}
          ref={start_or_end(idx, jdx) === 'start' ? prev_ref : null}
          // className={`${classes} ${hover ? 'hover' : null}`}
          className={hover_classes[lin_index] || 'col'}
        >
          {is_valid ? d : null}
        </div>
      );
    }; // <Col />

    // - - - - - - - - - - - - - - - - - - - - -

    let days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    // - - - - - - - - - - - - - - - - - - - - -

    return (
      <div className='calendar-container'>
        <div
          style={{
            background: 'black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              // border: 'solid hotpink 2px',
              position: 'relative', // used to fix the month in the center so it does not move when the arrows are clicked
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            <svg
              width='52'
              height='52'
              fill='currentColor'
              className='chevron-left'
              viewBox='0 0 16 16'
              onClick={() => {
                resetDateRange();

                if (0 <= month - 1) {
                  setMonth((prev) => {
                    const new_month = prev - 1;

                    const { days_in_month: d_in_m, first_day: f_d } =
                      getMonthInfo(year, new_month);

                    setDaysInMonth(d_in_m);
                    setFirstDay(f_d);

                    return new_month;
                  });
                } else {
                  setYear((prev) => {
                    const new_year = prev - 1;

                    const { days_in_month: d_in_m, first_day: f_d } =
                      getMonthInfo(new_year, 0);

                    setDaysInMonth(d_in_m);
                    setFirstDay(f_d);

                    return new_year;
                  });
                  setMonth(11); // jan. following year
                }
              }}
            >
              <path
                fillRule='evenodd'
                d='M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z'
              />
            </svg>

            <div
              style={{
                position: 'absolute',
                fontSize: '1.8em',
              }}
            >
              <h3>
                {
                  [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                  ][month]
                }{' '}
                {year}
              </h3>
            </div>

            <svg
              width='52'
              height='52'
              fill='currentColor'
              className='chevron-right'
              viewBox='0 0 16 16'
              onClick={() => {
                resetDateRange();

                if (month + 1 < 12) {
                  setMonth((prev) => {
                    const new_month = prev + 1;

                    const { days_in_month: d_in_m, first_day: f_d } =
                      getMonthInfo(year, new_month);

                    setDaysInMonth(d_in_m);
                    setFirstDay(f_d);

                    return new_month;
                  });
                } else {
                  setYear((prev) => {
                    const new_year = prev + 1;

                    const { days_in_month: d_in_m, first_day: f_d } =
                      getMonthInfo(new_year, 0);

                    setDaysInMonth(d_in_m);
                    setFirstDay(f_d);

                    return new_year;
                  });
                  setMonth(0); // jan. following year
                }
              }}
            >
              <path
                fillRule='evenodd'
                d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z'
              />
            </svg>
          </div>
        </div>
        <div className='row day-titles'>
          {days.map((day) => {
            return (
              <div key={day} className='day-title'>
                <p>{day}</p>
              </div>
            );
          })}
        </div>
        <Row idx={0}>
          {days.map((day, jdx) => (
            <Col key={day} idx={0} jdx={jdx} />
          ))}
        </Row>
        <Row idx={1}>
          <Col idx={1} jdx={0} />
          <Col idx={1} jdx={1} />
          <Col idx={1} jdx={2} />
          <Col idx={1} jdx={3} />
          <Col idx={1} jdx={4} />
          <Col idx={1} jdx={5} />
          <Col idx={1} jdx={6} />
        </Row>
        <Row idx={2}>
          <Col idx={2} jdx={0} />
          <Col idx={2} jdx={1} />
          <Col idx={2} jdx={2} />
          <Col idx={2} jdx={3} />
          <Col idx={2} jdx={4} />
          <Col idx={2} jdx={5} />
          <Col idx={2} jdx={6} />
        </Row>
        <Row idx={3}>
          <Col idx={3} jdx={0} />
          <Col idx={3} jdx={1} />
          <Col idx={3} jdx={2} />
          <Col idx={3} jdx={3} />
          <Col idx={3} jdx={4} />
          <Col idx={3} jdx={5} />
          <Col idx={3} jdx={6} />
        </Row>
        <Row idx={4}>
          <Col idx={4} jdx={0} />
          <Col idx={4} jdx={1} />
          <Col idx={4} jdx={2} />
          <Col idx={4} jdx={3} />
          <Col idx={4} jdx={4} />
          <Col idx={4} jdx={5} />
          <Col idx={4} jdx={6} />
        </Row>
        <Row idx={5}>
          <Col idx={5} jdx={0} />
          <Col idx={5} jdx={1} />
          <Col idx={5} jdx={2} />
          <Col idx={5} jdx={3} />
          <Col idx={5} jdx={4} />
          <Col idx={5} jdx={5} />
          <Col idx={5} jdx={6} />
        </Row>
      </div>
    );

    // - - - - - - - - - - - - - - - - - - - - -
  };

  // --------------------------------------------

  return (
    <div className='app'>
      <CalendarLayer0 />
      <div>
        <h2>Click Num: {click_num !== null ? click_num : 'null'}</h2>
        <h2>Year: {year}</h2>
        <h2>Month: {month}</h2>
        <h2>Days In Month: {days_in_month}</h2>
        <hr />
        <h3>Date Range Lo:</h3>
        <h2>Y: {date_range_0?.year}</h2>
        <h2>M: {date_range_0?.month}</h2>
        <h2>D: {date_range_0?.date}</h2>
        <h3>
          Lin Index:{' '}
          {date_range_0 !== undefined ? date_range_0?.lin_index : 'null'}
        </h3>

        <hr />
        <h3>Date Range Hi:</h3>
        <h2>Y: {date_range_1?.year}</h2>
        <h2>M: {date_range_1?.month}</h2>
        <h2>D: {date_range_1?.date}</h2>
      </div>
    </div>
  );

  // --------------------------------------------
}
