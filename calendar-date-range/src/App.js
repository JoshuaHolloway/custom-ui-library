import './App.css';
// import { ROWS, COLS } from './constants';

export default function App() {
  // --------------------------------------------

  const clickHandler = (idx, jdx) => (e) => {
    console.log(`idx: ${idx}\tjdx: ${jdx}`);
  };

  // --------------------------------------------

  // Strategy:
  //  -Step 1: Record where the two clicks are at
  //  -Step 2:
  //  -Step 3:

  const Row = ({ idx, children }) => <div className='row'>{children}</div>;
  const Col = ({ idx, jdx, children }) => (
    <div className='col' onClick={clickHandler(idx, jdx)}>
      {children}
    </div>
  );

  // --------------------------------------------

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

  // --------------------------------------------
}
