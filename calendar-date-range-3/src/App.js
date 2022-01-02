import { useState, useEffect } from 'react';
import './App.css';
import { getMonthInfo } from './date';
// import { ROWS, COLS } from './constants';

export default function App() {
  const [hover_index, setHoverIndex] = useState();

  // --------------------------------------------

  const [month, setMonth] = useState();
  const [year, setYear] = useState();

  const [days_in_month, setDaysInMonth] = useState();
  const [first_day, setFirstDay] = useState();

  useEffect(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth();

    setMonth(m);
    setYear(y);

    const { days_in_month: d_in_m, first_day: f_d } = getMonthInfo(y, m);
    console.log('first_day: ', f_d);

    setDaysInMonth(d_in_m);
    setFirstDay(f_d);
  }, []);

  useEffect(() => {
    console.log(
      'year: ',
      year,
      '\tnew_month: ',
      month,
      '\tdays_in_month: ',
      days_in_month,
      '\tfirst_day: ',
      first_day
    );
  }, [month]);

  // --------------------------------------------

  const [click_num, setClickNum] = useState(null);
  const handleClickNum = () =>
    setClickNum((prev) => {
      if (click_num) {
        return (prev + 1) % 2;
      } else {
        // -used to distinguish the very first click from the other ones (before first click_num is undefined)
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

  const CalendarLayer0 = () => {
    const clickHandler = (idx, jdx) => (e) => {
      // console.log(`idx: ${idx}\tjdx: ${jdx}`);

      if (click_num === 0 || !click_num) {
        // -1st click (click_num===null) and odd number clicks
        setIdxState0(idx);
        setJdxState0(jdx);
      } else if (click_num === 1) {
        setIdxState1(idx);
        setJdxState1(jdx);
      }
      handleClickNum();
    };

    const Row = ({ idx, children }) => <div className='row'>{children}</div>;
    const Col = ({ idx, jdx, children }) => {
      // 7 = num-days-in-week === num elements in each row
      const lin_index = idx * 7 + jdx;
      const d = lin_index - first_day + 1;
      // -days are 1-based
      // -this indexing is zero-based
      // -adjust by adding 1
      // -without the +1 the first day of the month is labeld as zero

      const is_valid = 0 < d && d <= days_in_month;
      const callback = is_valid ? clickHandler(idx, jdx) : () => {};

      return (
        <div
          className='col'
          onClick={callback}
          onMouseEnter={() => {
            setHoverIndex(lin_index);
          }}
          onMouseLeave={() => {
            setHoverIndex(null);
          }}
        >
          {/* {children} */}
          {is_valid ? d : null}
        </div>
      );
    };

    let days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

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
              <h2>
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
              </h2>
            </div>

            <svg
              width='52'
              height='52'
              fill='currentColor'
              className='chevron-right'
              viewBox='0 0 16 16'
              onClick={() => {
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
  };

  // --------------------------------------------

  const CalendarLayer1 = () => {
    const Row = ({ idx, children }) => <div className='row'>{children}</div>;
    const Col = ({ idx, jdx, children }) => {
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
            // -Middle ros
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
      } else if (on_or_off === true) {
        classes = `col ${on_or_off ? 'on' : 'off'} on-middle`;
      } else {
        classes = `col off`;
      }

      const lin_index = idx * 7 + jdx;
      const d = lin_index - first_day + 1;
      const is_valid = 0 < d && d <= days_in_month;

      if (lin_index === hover_index && is_valid && click_num !== 0) {
        classes = `${classes} hover`;
      }

      // const on_or_off = false;
      return <div className={classes}>{children}</div>;
    };

    return (
      <div className='calendar-container'>
        <div
          style={{
            background: 'black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        ></div>
        <div style={{ background: 'darkorchid' }}></div>
        <Row idx={0}>
          <Col idx={0} jdx={0} />
          <Col idx={0} jdx={1} />
          <Col idx={0} jdx={2} />
          <Col idx={0} jdx={3} />
          <Col idx={0} jdx={4} />
          <Col idx={0} jdx={5} />
          <Col idx={0} jdx={6} />
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
  };

  // --------------------------------------------

  return (
    <div className='app'>
      <CalendarLayer0 />
      <div>
        <h2>Click Num: {click_num}</h2>
        <h2>Year: {year}</h2>
        <h2>Month: {month}</h2>
        <h2>Days In Month: {days_in_month}</h2>
      </div>
      <CalendarLayer1 />
    </div>
  );

  // --------------------------------------------
}
