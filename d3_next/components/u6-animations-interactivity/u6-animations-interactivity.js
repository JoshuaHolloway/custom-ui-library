import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

// ==============================================

export default function U6AnimationsInteractivity() {
  // --------------------------------------------

  const svg_ref = useRef();

  // --------------------------------------------

  return (
    <div>
      <svg ref={svg_ref}></svg>
      <button
        onClick={() => {
          d3.select(div_ref.current)
            .selectAll('p')
            .data(DUMMY_DATA)
            .enter()
            .append('p')
            .text((dta) => dta.region); // bind the selection to the data
        }}
      >
        Click
      </button>
    </div>
  );

  // --------------------------------------------
}

// ==============================================
