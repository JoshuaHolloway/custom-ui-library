import React, { useState, useCallback, useEffect } from 'react';
import { csv, scaleLinear, scaleTime, max, timeFormat, extent } from 'd3';

import { useSpring, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';

import { useData } from '../helpers/useData';
import { AxisBottom } from '../components/AxisBottom';
import { AxisLeft } from '../components/AxisLeft';
import { Marks } from '../components/Marks';

const width = 960;
const height = 500;
const margin = { top: 20, right: 30, bottom: 65, left: 90 };
const xAxisLabelOffset = 50;
const yAxisLabelOffset = 45;

import css from '../styles/Home.module.css';

// ==============================================

export default function Home() {
  const data = useData();

  // --------------------------------------------

  const slider_pos = useSpring({ x: 0 });

  const bindSliderPos = useDrag((params) => {
    // setLogoPos({
    //   x: params.offset[0],
    //   y: params.offset[1],
    // });

    slider_pos.x.set(params.offset[0]);

    // const y = params.xy[1];
    // if (params.dragging) {
    //   if (y >= 0 && y < SCREEN_HEIGHT) {
    //     logoPos.y.set(params.offset[1]);
    //   }
    // } else {
    //   if (y > SCREEN_HEIGHT / 2) {
    //     // logoPos.y.set(y);
    //     logoPos.y.start(y); // snap
    //   } else {
    //     // top half
    //     // logoPos.y.set(0);
    //     logoPos.y.start(0); // snap
    //   }
    // }
  });
  // --------------------------------------------

  if (!data) {
    return <pre>Loading...</pre>;
  }

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  const xValue = (d) => d.timestamp;
  const xAxisLabel = 'Time';

  const yValue = (d) => d.temperature;
  const yAxisLabel = 'Temperature';

  const xAxisTickFormat = timeFormat('%a');

  const xScale = scaleTime()
    .domain(extent(data, xValue))
    .range([0, innerWidth])
    .nice();

  const yScale = scaleLinear()
    .domain(extent(data, yValue))
    .range([innerHeight, 0])
    .nice();

  // --------------------------------------------
  return (
    <div
      className='container'
      style={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        border: 'solid hotpink 2px',
      }}
    >
      <svg
        width={width}
        height={height}
        style={{ position: 'absolute', top: '50', left: '50' }}
      >
        {/* <g transform={`translate(${margin.left},${margin.top})`}> */}
        <g>
          <AxisBottom
            xScale={xScale}
            innerHeight={innerHeight}
            tickFormat={xAxisTickFormat}
            tickOffset={7}
          />
          <text
            className='axis-label'
            textAnchor='middle'
            transform={`translate(${-yAxisLabelOffset},${
              innerHeight / 2
            }) rotate(-90)`}
          >
            {yAxisLabel}
          </text>
          <AxisLeft yScale={yScale} innerWidth={innerWidth} tickOffset={7} />
          <text
            className='axis-label'
            x={innerWidth / 2}
            y={innerHeight + xAxisLabelOffset}
            textAnchor='middle'
          >
            {xAxisLabel}
          </text>
          <Marks
            data={data}
            xScale={xScale}
            yScale={yScale}
            xValue={xValue}
            yValue={yValue}
            tooltipFormat={xAxisTickFormat}
            circleRadius={3}
          />
        </g>
      </svg>
      <animated.div {...bindSliderPos()} style={{ x: slider_pos.x }}>
        <div
          style={{
            position: 'absolute',
            left: '370px',
            height: '480px',
            width: '100px',
            background: 'rgba(255,255,255, 0.2)',
            backdropFilter: 'blur(4px)',
            filter: 'blur(2px)',
            border: 'solid 2px rgba(0,0,0, 0.05)',
            backgroundClip: 'padding-box',
            boxShadow: '10px 10px 10px  rgba(46, 54, 68, 0.03)',
          }}
        />
      </animated.div>
    </div>
  );

  // --------------------------------------------
}

// ==============================================
