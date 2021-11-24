async function draw() {
  // Data
  const dataset = await d3.json('data.json');

  // Dimensions
  let dimensions = {
    width: 800,
    height: 800,
    margin: {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50,
    },
  };
  dimensions.ctrWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.ctrHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // Draw Image
  const svg = d3
    .select('#chart')
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height);

  const ctr = svg
    .append('g')
    .attr(
      'transform',
      `translate(${dimensions.margin.left}, ${dimensions.margin.right})`
    );

  const tooltip = d3.select('#tooltip');

  // -We want to have exactly the same number of elements
  //  as datapoints.
  // -Strategy:
  //  --Create a selection of circles.
  //  --D3 will return an empty selection because we haven't drawn any circles in the image.
  //  --We then join the dataset with the empty selection.
  //  --This will force D3 to put the dataset into an enter selection.
  //  --From there, we can begin the process of drawing the circles for each item in the enter selection.

  // --------------------------------------------

  // -Accessor functions:
  //  --If our selection has data joined to it, D3 will allow us to access
  //    the data associated with the current element.
  //  --D3 can loop through each element in the selection.
  //  --The data joined to an element will be passed onto our accessor function.
  const xAccessor = (d) => {
    // console.log('xAccessor:  d.currently.humidity: ', d.currently.humidity);
    return d.currently.humidity;
  };
  const yAccessor = (d) => {
    // console.log(
    //   'yAccessor:  d.currently.apparentTemperature: ',
    //   d.currently.apparentTemperature
    // );
    return d.currently.apparentTemperature;
  };

  // --------------------------------------------

  // -Scales (theory)
  const slices = [100, 200, 300, 400, 500];

  // d3.scaleLinear()
  const scale = d3.scaleLinear();
  console.log('scale(100): ', scale(slices[0]));
  console.log('scale(500): ', scale(slices[4]));

  // .domain().range()
  const scale2 = d3.scaleLinear().domain([100, 500]).range([10, 350]);
  console.log('scale2(100): ', scale2(slices[0]));
  console.log('scale2(500): ', scale2(slices[4]));

  // d3.min() / d3.max()
  const scale3 = d3
    .scaleLinear()
    .domain([d3.min(slices), d3.max(slices)])
    .range([10, 350]);
  console.log('scale(100): ', scale3(slices[0]));
  console.log('scale(500): ', scale3(slices[4]));

  // d3.extent()
  const scale4 = d3.scaleLinear().domain(d3.extent(slices)).range([10, 350]);
  console.log('scale(100): ', scale4(slices[0]));
  console.log('scale(500): ', scale4(slices[4]));

  // --------------------------------------------

  // -Scales (implementation)
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    //.range([0, dimensions.ctrWidth]);
    .rangeRound([0, dimensions.ctrWidth]) // round the output range values (only applies to output range)
    .clamp(true); // don't transform values outside the range of the output

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    // .range([0, dimensions.ctrHeight])
    .rangeRound([dimensions.ctrHeight, 0]) // round the output range values (only applies to output range)
    .nice() // round (applied to both domain and range)
    .clamp(true); // don't transform values outside the range of the output

  // --------------------------------------------

  // -Draw circles
  ctr
    .selectAll('circle')
    .data(dataset)
    .join('circle')
    .attr('cx', (d) => xScale(xAccessor(d))) // .attr('cx', xAccessor)
    .attr('cy', (d) => yScale(yAccessor(d))) //.attr('cy', yAccessor)
    .attr('r', 5) // radius
    .attr('fill', 'red');

  // --------------------------------------------

  // -Axes
  // const xAxis = d3.axisBottom().scale(xScale); // .scale() determines how long the axis should be drawn and where to place the ticks
  const xAxis = d3
    .axisBottom(xScale) // -This is the same as .scale(xScale)
    .ticks(5) // -Set suggestion of number of ticks. D3 will evenly distribute the ticks such that the number of ticks are as close as possible to our suggestion.
    // .tickValues([0.4, 0.5, 0.8]); // -Specific exact tick values
    .tickFormat((d) => `${d * 100}%`); // -Modifity the tick labels

  const xAxisGroup = ctr
    // -Axis will be draw inside another group because the axis function draws many shapes.
    // -This is just for orgnanization purposes.
    .append('g')
    // -Every axis function will return a function for drawing an axis.
    // -The x-axis function can't be called directly.
    // -D3 works by chaining functions together, but the xAxis function is independent.
    // -It will not work well with the chain.
    // -A trick is to use the .call() method which will allow us to use the x-axis function in the chain.
    .call(xAxis) // the axis will now be drawn.
    // -To get the axis to the bottom we need to move the group element.
    // -Any actions applied (properties set) on the g-element are also applied to its children.
    // -The xAxis function returns a selection.
    // -We are allowed to apply transformations after drawing the axis.
    .style('transform', `translateY(${dimensions.ctrHeight}px)`)
    .classed('axis', true); // set the font-size of the axis

  xAxisGroup
    // -Add a text element
    .append('text')
    // -Shift the text element inside the group to the center of the axis and down slightly;
    .attr('x', dimensions.ctrWidth / 2)
    .attr('y', dimensions.margin.bottom - 10)
    .attr('fill', 'black')
    .text('Humidity'); // -Place text in the text element.

  // --------------------------------------------

  const yAxis = d3.axisLeft(yScale);
  const yAxisGroup = ctr
    .append('g')
    .call(yAxis)
    // .style('transform', `translateX(0)`)
    .classed('axis', true);

  yAxisGroup
    .append('text')
    .attr('x', -dimensions.ctrHeight / 2)
    .attr('y', -dimensions.margin.left + 15)
    .attr('fill', 'black')
    .html('Temperature &deg; F')
    .style('transform', 'rotate(270deg)')
    .style('text-anchor', 'middle');

  // --------------------------------------------

  const delaunay = d3.Delaunay.from(
    dataset,
    (d) => xScale(xAccessor(d)),
    (d) => yScale(yAccessor(d))
  );
  // console.log('delaunay', delaunay);

  const voronoi = delaunay.voronoi();
  console.log('voronoi: ', voronoi);
  voronoi.xmax = dimensions.ctrWidth;
  voronoi.ymax = dimensions.ctrHeight;

  ctr
    .append('g')
    .selectAll('path')
    .data(dataset)
    .join('path')
    // .attr('stroke', 'black')
    .attr('fill', 'transparent')
    .attr('d', (d, i) => voronoi.renderCell(i /* index of partition to draw */))
    .on('mouseenter', function (event, datum) {
      // -Not using arrow-function because we want to use the 'this'-keyword
      // -'this'-keyword will tell us which dot the mouse is hovered over.
      // -Even though we are listening to the event on the entire selection.
      //  D3 is smart enough to provide us with the info about a specific dot.
      // -In addition, we are going to need the data joined to the element.
      // -We can accept the data as one of the arguements to the callback function.
      console.log('datum: ', datum, '\tevent: ', event);

      // -Step 1: Change color and size of dot the user is hovering over.
      //d3.select(this) // -'this' references the element the user is hovering over
      ctr
        .append('circle')
        .classed('dot-hovered', true)
        .attr('fill', '#120078') // change color of dot
        .attr('r', 8)
        .attr('cx', (d) => xScale(xAccessor(datum))) // .attr('cx', xAccessor)
        .attr('cy', (d) => yScale(yAccessor(datum))) //.attr('cy', yAccessor)
        .style('pointer-events', 'none');

      // -Step 2: Move tooltip.
      // Change tooltip slection's display property => display:none -> display:block
      tooltip
        .style('display', 'block')
        .style('top', `${yScale(yAccessor(datum)) - 25}px`)
        .style('left', `${xScale(xAccessor(datum)) + 25}px`);

      const formatter = d3.format('.2f');
      const dateFormatter = d3.timeFormat('%B %-d, %Y');

      // -Step 3: Add data to tooltip
      tooltip
        .select('.metric-humidity > span')
        .text(formatter(xAccessor(datum)));
      tooltip.select('.metric-temp > span').text(formatter(yAccessor(datum)));
      tooltip
        .select('.metric-date')
        .text(dateFormatter(datum.currently.time * 1000));
    })
    .on('mouseleave', function (event, datum) {
      // d3.select(this).attr('fill', 'red').attr('r', 5);
      // ctr.classed('dot-hovered', false);
      ctr.select('.dot-hovered').remove();
      tooltip.style('display', 'none');
    });

  // --------------------------------------------

  // --------------------------------------------
}

// ==============================================

draw();
