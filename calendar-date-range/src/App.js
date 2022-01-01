import { useState, useEffect } from 'react';
import './App.css';
// import { ROWS, COLS } from './constants';

export default function App() {
  // --------------------------------------------

  const [click_num, setClickNum] = useState(0);
  const handleClickNum = () => setClickNum((prev) => (prev + 1) % 2);
  // const [idx_state, setIdxState] = useState([0, 0]);
  // const [jdx_state, setJdxState] = useState([0, 0]);
  const [idx_state_0, setIdxState0] = useState();
  const [jdx_state_0, setJdxState0] = useState();
  const [idx_state_1, setIdxState1] = useState();
  const [jdx_state_1, setJdxState1] = useState();

  useEffect(() => {
    console.log(
      'click_num: ',
      click_num,
      '\tstate_0: (',
      idx_state_0,
      ', ',
      jdx_state_0,
      ')\tstate_1: (',
      idx_state_1,
      ', ',
      jdx_state_1,
      ')'
    );
  }, [idx_state_0, idx_state_0, jdx_state_1, jdx_state_1]);

  // --------------------------------------------

  // Strategy:
  //  -Step 1: Record where the two clicks are at
  //  -Step 2: Determine if click_num is 1st or second click
  //    --If 1st click, then set 1st idx,jdx state values
  //    --If 2nd click, then set 2nd idx,jdx state values
  //  -Step 3:

  // --------------------------------------------

  const CalendarLayer0 = () => {
    const clickHandler = (idx, jdx) => (e) => {
      // console.log(`idx: ${idx}\tjdx: ${jdx}`);

      if (click_num === 0) {
        setIdxState0(idx);
        setJdxState0(jdx);
      } else if (click_num === 1) {
        setIdxState1(idx);
        setJdxState1(jdx);
      }
      handleClickNum();
    };

    const Row = ({ idx, children }) => <div className='row'>{children}</div>;
    const Col = ({ idx, jdx }) => (
      <div className='col' onClick={clickHandler(idx, jdx)}>
        {idx === idx_state_0 && jdx === jdx_state_0 ? 'start' : null}
        {idx === idx_state_1 && jdx === jdx_state_1 && click_num === 0
          ? 'end'
          : null}
      </div>
    );

    return (
      <div className='calendar-container'>
        <Row idx={0}>
          <Col idx={0} jdx={0} />
          <Col idx={0} jdx={1} />
        </Row>
        <Row idx={1}>
          <Col idx={1} jdx={0} />
          <Col idx={1} jdx={1} />
        </Row>
      </div>
    );
  };

  // --------------------------------------------

  const CalendarLayer1 = () => {
    const Row = ({ idx, children }) => <div className='row'>{children}</div>;
    const Col = ({ idx, jdx, children }) => {
      const on_or_off =
        idx_state_0 <= idx &&
        idx <= idx_state_1 &&
        jdx_state_0 <= jdx &&
        jdx <= jdx_state_1;
      // const on_or_off = false;
      const classes = `col ${on_or_off ? 'on' : 'off'}`;
      return <div className={classes}>{children}</div>;
    };

    return (
      <div className='calendar-container'>
        <Row idx={0}>
          <Col idx={0} jdx={0} />
          <Col idx={0} jdx={1} />
        </Row>
        <Row idx={1}>
          <Col idx={1} jdx={0} />
          <Col idx={1} jdx={1} />
        </Row>
      </div>
    );
  };

  // --------------------------------------------

  return (
    <div className='app'>
      <CalendarLayer0 />
      <h2>Click Num: {click_num}</h2>
      <CalendarLayer1 />
    </div>
  );

  // --------------------------------------------
}
