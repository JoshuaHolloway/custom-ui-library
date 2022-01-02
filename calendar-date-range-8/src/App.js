import { useState, useEffect, useRef } from 'react';
import './App.css';
import { getMonthInfo } from './date';
// import { ROWS, COLS } from './constants';

// ==============================================

export default function App() {
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
    setDateRange0(null);
    setDateRange1(null);
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

  // --------------------------------------------

  // -Layer 0: Click input handling logic
  const CalendarLayer0 = () => {
    // - - - - - - - - - - - - - - - - - - - - -
    const clickHandler = (idx, jdx) => (e) => {
      const { d, lin_index } = indices2day(idx, jdx);

      if (click_num === 0 || !click_num) {
        // -1st date-range click
        // -1st click (click_num===null) and odd number clicks

        // -Click handlers are applied only to valid region.
        //  => We can just store the date without checking validity.
        setDateRange0({ year, month, date: d, idx, jdx, lin_index });
        setHoverIndex(lin_index); // trigger the useEffect callback to draw circle around currently hovered Col-element
      } else if (click_num === 1) {
        // -Second date-range click
        if (date_range_0.date <= d) {
          // -standard case (date-1 <= date-2)

          // -Click handlers are applied only to valid region.
          //  => We can just store the date without checking validity.
          setDateRange1({ year, month, date: d, idx, jdx, lin_index });
        } else {
          // -backward case (date-1 > date-2)

          // -step 1: set click-2 state to click-1
          setDateRange1({ ...date_range_0 });

          // -step 2: set date_range_0 to current values
          setDateRange0({ year, month, date: d, idx, jdx, lin_index });
        }
      }
      handleClickNum();
    };

    // - - - - - - - - - - - - - - - - - - - - -

    const [hover_classes, setHoverClasses] = useState(new Array(7 * 7));
    const [hover_index, setHoverIndex] = useState();

    useEffect(() => {
      // if (click_num === null) {
      //   // -Openeing state (user has not clicked yet)
      //   const hover_classes_copy = [...hover_classes];
      //   hover_classes_copy[hover_index] = 'col on on-start-and-end';
      //   setHoverClasses(hover_classes_copy);
      // }

      if (click_num === 1) {
        // -Light up currently hovered:
        const hover_classes_copy = [...hover_classes];

        for (let i = 0; i < hover_classes.length; ++i) {
          if (date_range_0.lin_index < hover_index) {
            // -Regular case (date_0 <= date_1 [hover])
            if (date_range_0.lin_index <= i && i <= hover_index) {
              // -[date_range_0.lin_index, hover_index]
              if (date_range_0.lin_index === i) {
                hover_classes_copy[i] = 'col on on-start';
              } else if (i === hover_index) {
                hover_classes_copy[i] = 'col on on-end';
              } else {
                hover_classes_copy[i] = 'col on on-middle';
              }
            } else {
              // -[0, date_range_0.lin_index) || (date_range_0.lin_index, 7 * 7 - 1)
              hover_classes_copy[i] = 'col';
            }
          } else if (hover_index < date_range_0.lin_index) {
            // -Backwards case (date_0 > date_1)
            if (hover_index <= i && i <= date_range_0.lin_index) {
              // -[hover_index, date_range_0.lin_index]
              if (date_range_0.lin_index === i) {
                hover_classes_copy[i] = 'col on on-end';
              } else if (i === hover_index) {
                hover_classes_copy[i] = 'col on on-start';
              } else {
                hover_classes_copy[i] = 'col on on-middle';
              }
            } else {
              // -[0, hover_index) || (hover_index, 7 * 7 - 1)
              hover_classes_copy[i] = 'col';
            }
          } else {
            console.log('j');
            if (hover_index === i && i === date_range_0.lin_index) {
              // -hovered on the same day as date_0
              hover_classes_copy[i] = 'col on on-start-and-end';
            } else {
              hover_classes_copy[i] = 'col';
            }
          }
        }

        // hover_classes_copy[date_range_0.lin_index] = 'col on on-end';
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

      return (
        <div
          className={hover_classes[lin_index] || 'col'}
          onClick={callback}
          onMouseEnter={() => {
            if (click_num !== 0 && is_valid) {
              // -Three click_num states:
              //  --null. Before first click
              //  --1.    After first (and odd-numbered) click(s)
              //  --0.    After second (and even-numbered) click(s)
              setHoverIndex(lin_index);
            }
          }}
          onMouseLeave={() => {
            // setHover(false);
          }}
          // ref={start_or_end(idx, jdx) === 'start' ? prev_ref : null}
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
