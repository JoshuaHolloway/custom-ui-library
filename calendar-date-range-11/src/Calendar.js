import { useState, useEffect } from 'react';
import { getMonthInfo } from './date';

// -Layer 0: Click input handling logic
let calendar_count = 0;
let col_count = 0;
export default function Calendar() {
  calendar_count++;
  console.log('Calendar Render');

  // --------------------------------------------

  const [date_range_0, setDateRange0] = useState(); // {year: y, month: m, date: d, idx, jdx}: {year: number, month: number, date: number, idx: number, jdx: number, lin_index: number}
  const [date_range_1, setDateRange1] = useState();

  const [month, setMonth] = useState();
  const [year, setYear] = useState();

  const [days_in_month, setDaysInMonth] = useState();
  const [first_day, setFirstDay] = useState(); // first_day: number

  // --------------------------------------------

  // -Three click_num states:
  //  --null. Before first click
  //  --1.    After first (and odd-numbered) click(s)
  //  --0.    After second (and even-numbered) click(s)
  const [click_num, setClickNum] = useState(null);
  const handleClickNum = () =>
    setClickNum((prev) => {
      if (click_num) {
        const click_nums = 3;
        return (prev + 1) % click_nums;
      } else {
        // -used to distinguish the very first click from the other ones (before first click_num is null)
        // -specifically used for the hover
        //  --We want the hover to work before any clicks.
        //  --But after that we only want it to work between first and second clicks.
        return 1; // first-click
      }
    });

  // --------------------------------------------

  // -Set todays date
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

  const resetDateRangeGUI = () => {
    const hover_classes_copy = [...hover_classes];
    for (let i = 0; i < hover_classes.length; ++i) {
      hover_classes_copy[i] = 'col';
    }
    setHoverClasses(hover_classes_copy);
  };

  const resetDateRange = () => {
    setClickNum(null);
    setDateRange0(null);
    setDateRange1(null);
    resetDateRangeGUI();
  };

  // --------------------------------------------

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

  // --------------------------------------------

  const clickHandler = (idx, jdx) => (e) => {
    const { d, lin_index } = indices2day(idx, jdx);

    if (click_num === null) {
      // -1st date-range click
      // -1st click (click_num===null) and odd number clicks

      // -Click handlers are applied only to valid region.
      //  => We can just store the date without checking validity.
      setDateRange0({ year, month, date: d, idx, jdx, lin_index });
      handleClickNum();
    } else if (click_num === 1) {
      // -Second date-range click
      if (date_range_0?.date <= d) {
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
      handleClickNum();
    } else if (click_num === 2) {
      resetDateRange();
    }
  };

  useEffect(() => {
    // -Set the first click after resetting (on the third click)
    // -Flow goes like this:
    //    clickHandler()  ->  handleClickNum()  ->  useEffect(() => {}, [click_num])
    if (click_num === null) {
      const hover_classes_copy = [...hover_classes];
      for (let i = 0; i < hover_classes.length; ++i) {
        if (i === hover_index) {
          hover_classes_copy[hover_index] = 'col on on-start-and-end';
        } else {
          hover_classes_copy[i] = 'col';
        }
      }
      setHoverClasses(hover_classes_copy);
    }
  }, [click_num]);

  // --------------------------------------------

  // const [final_state, setFinalState] = useState(false);
  const [hover_classes, setHoverClasses] = useState(new Array(7 * 7));
  const [hover_index, setHoverIndex] = useState();

  // --------------------------------------------

  const dateRangeLogic = (hover_classes_copy) => {
    const d0_index = date_range_0?.lin_index;

    for (let i = 0; i < hover_classes.length; ++i) {
      if (d0_index < hover_index) {
        // -Regular case (date_0 <= date_1 [hover])
        if (d0_index <= i && i <= hover_index) {
          // -[date_range_0.lin_index, hover_index]
          if (d0_index === i) {
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
      } else if (hover_index < d0_index) {
        // -Backwards case (date_0 > date_1)
        if (hover_index <= i && i <= d0_index) {
          // -[hover_index, date_range_0.lin_index]
          if (d0_index === i) {
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
        if (hover_index === i && i === d0_index) {
          // -hovered on the same day as date_0
          hover_classes_copy[i] = 'col on on-start-and-end';
        } else {
          hover_classes_copy[i] = 'col';
        }
      }
    }
  };

  // --------------------------------------------

  useEffect(() => {
    const hover_classes_copy = [...hover_classes];

    console.log('UseEffect [hover_index]');

    if (click_num === null) {
      // -Openeing state (user has not clicked yet)
      for (let i = 0; i < hover_classes.length; ++i) {
        if (i === hover_index) {
          hover_classes_copy[i] = 'col on on-start-and-end';
        } else {
          hover_classes_copy[i] = 'col';
        }
      }
    } else if (click_num === 1) {
      if (hover_index) {
        dateRangeLogic(hover_classes_copy);
      } else {
        // -First click
        hover_classes_copy[date_range_0.lin_index] = 'col on on-start-and-end';
      }
    }

    setHoverClasses(hover_classes_copy);
  }, [hover_index]);

  // --------------------------------------------

  const Row = ({ children }) => <div className='row'>{children}</div>;
  const Col = ({ idx, jdx }) => {
    col_count++;
    const { d, lin_index, is_valid } = indices2day(idx, jdx);

    const callback = is_valid ? clickHandler(idx, jdx) : () => {};

    return (
      <div
        className={hover_classes[lin_index] || 'col'}
        onClick={callback}
        onMouseEnter={() => {
          if (click_num !== 2 && is_valid) {
            setHoverIndex(lin_index);
          }
        }}
      >
        {is_valid ? d : null}
      </div>
    );
  }; // <Col />

  // --------------------------------------------

  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const months = [
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
  ];

  // --------------------------------------------

  console.log('calendar_count: ', calendar_count, '\tcol_count: ', col_count);

  // --------------------------------------------

  return (
    <>
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
                setHoverIndex(null);

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
                {months[month]} {year}
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
                setHoverIndex(null);

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

        {[...new Array(7)].map((week, idx) => (
          <Row key={idx} idx={idx}>
            {days.map((day, jdx) => (
              <Col key={idx * 7 + jdx} idx={idx} jdx={jdx} />
            ))}
          </Row>
        ))}
      </div>
      <h1 style={{ width: '300px' }}>
        Click Num: {click_num ? click_num : 'null'}
      </h1>
    </>
  );

  // --------------------------------------------
}
