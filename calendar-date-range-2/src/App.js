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
    } else if (idx === idx_state_1 && jdx === jdx_state_1 && click_num === 0) {
      // -Case 2: End of date range
      return 'end';
    }
  };

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
        {start_or_end(idx, jdx) === 'start' ? 'start' : null}
        {start_or_end(idx, jdx) === 'end' ? 'end' : null}
        {start_or_end(idx, jdx) === 'start-and-end' ? 'start and end' : null}
      </div>
    );

    return (
      <div className='calendar-container'>
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
        <Row idx={6}>
          <Col idx={6} jdx={0} />
          <Col idx={6} jdx={1} />
          <Col idx={6} jdx={2} />
          <Col idx={6} jdx={3} />
          <Col idx={6} jdx={4} />
          <Col idx={6} jdx={5} />
          <Col idx={6} jdx={6} />
        </Row>
      </div>
    );
  };

  // --------------------------------------------

  const CalendarLayer1 = () => {
    const Row = ({ idx, children }) => <div className='row'>{children}</div>;
    const Col = ({ idx, jdx, children }) => {
      let on_or_off = false; // true -> on, false -> off
      if (click_num === 0) {
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

      let classes = 'col-layer1';
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

      // const on_or_off = false;
      return <div className={classes}>{children}</div>;
    };

    return (
      <div className='calendar-container'>
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
        <Row idx={6}>
          <Col idx={6} jdx={0} />
          <Col idx={6} jdx={1} />
          <Col idx={6} jdx={2} />
          <Col idx={6} jdx={3} />
          <Col idx={6} jdx={4} />
          <Col idx={6} jdx={5} />
          <Col idx={6} jdx={6} />
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
