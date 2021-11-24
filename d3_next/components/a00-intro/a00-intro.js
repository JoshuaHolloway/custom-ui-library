import { useRef } from 'react';

import * as d3 from 'd3';
// ==============================================

export default function A00_Intro() {
  // --------------------------------------------

  const fruits = [
    { name: '🍊', count: 21 },
    { name: '🍇', count: 13 },
    { name: '🍏', count: 8 },
    { name: '🍌', count: 5 },
    { name: '🍐', count: 3 },
    { name: '🍋', count: 2 },
    { name: '🍎', count: 1 },
    { name: '🍉', count: 1 },
  ];

  const count_dim = fruits.map((d) => d.count); // the count dimension (quantitative)
  console.log('count_dim: ', count_dim);

  const name_dim = fruits.map((d) => d.name); // the name dimension (nominal)
  console.log('name_dim: ', name_dim);

  const margin = { left: 100, right: 200 };
  const width = 50;

  // x = f(n)
  // const x = d3
  //   .scaleLinear()
  //   .domain([0, d3.max(fruits, (d) => d.count)])
  //   .range([margin.left, width - margin.right])
  //   .interpolate(d3.interpolateRound);
  // console.log('x: ', x);

  // console.log('d3: ', d3);

  // --------------------------------------------

  const svg_ref = useRef();
  const DUMMY_DATA = [
    { id: 'd1', value: 10, region: 'USA' },
    { id: 'd2', value: 11, region: 'India' },
    { id: 'd3', value: 12, region: 'China' },
    { id: 'd4', value: 13, region: 'Germany' },
  ];

  // --------------------------------------------

  return (
    <div>
      <svg ref={svg_ref}></svg>
      <button
        onClick={() => {
          // d3.select(div_ref.current)
          //   .selectAll('p')
          //   .data(DUMMY_DATA)
          //   .enter()
          //   .append('p')
          //   .text((dta) => dta.region); // bind the selection to the data

          const container = d3
            .select(svg_ref.current)
            .classed('container', true)
            .style('border', '2px solid red');

          container
            .selectAll('.bar')
            .data(DUMMY_DATA)
            .enter()
            // determine which data was not rendered yet;
            .append('div') // append a new div for every missing element
            .classed('bar', true) // add the bar class so that selectAll will find it (them)
            .style('width', '50px')
            .style('height', (data) => `${data.value * 15}px`);
        }}
      >
        Click
      </button>
    </div>
  );

  // --------------------------------------------
}

// ==============================================
