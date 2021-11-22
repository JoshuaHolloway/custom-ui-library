import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useWorldAtlas } from '../helpers/useWorldAtlas';
import { useData } from '../helpers/useData';
import { BubbleMap } from '../components/BubbleMap/index';
import { DateHistogram } from '../components/DateHistogram/index';

const width = 960;
const height = 500;
const dateHistogramSize = 0.2;

const xValue = (d) => d['Reported Date'];

// import styles from '../styles/Home.module.css';

// ==============================================

export default function Home() {
  // --------------------------------------------

  const worldAtlas = useWorldAtlas();
  const data = useData();
  const [brushExtent, setBrushExtent] = useState();

  // --------------------------------------------

  if (!worldAtlas || !data) {
    return <pre>Loading...</pre>;
  }

  // --------------------------------------------

  const filteredData = brushExtent
    ? data.filter((d) => {
        console.log('filteredData()');

        const date = xValue(d);
        return date > brushExtent[0] && date < brushExtent[1];
      })
    : data;

  // --------------------------------------------
  return (
    <div>
      {' '}
      <svg width={width} height={height}>
        <BubbleMap data={filteredData} worldAtlas={worldAtlas} />
        <g transform={`translate(0, ${height - dateHistogramSize * height})`}>
          <DateHistogram
            data={data}
            width={width}
            height={dateHistogramSize * height}
            setBrushExtent={setBrushExtent}
            xValue={xValue}
          />
        </g>
      </svg>
    </div>
  );
}

// ==============================================
