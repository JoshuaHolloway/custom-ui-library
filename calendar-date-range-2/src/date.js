const getMonthInfo = (y, m) => {
  // Input:
  //  y (year):   number
  //  m (month):  number [zero-indexed]
  //  d (year):   number
  //
  // Output:
  //  { days_in_month, first_day}
  //  -days_in_month: number  - number of days in a secific month
  //  -first_day: string      - the name of the day the 1st day of the month occurs on ['sun', 'mon', etc.]

  const first_day = new Date(y, m, 1).getDay();
  const first_day_str = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][
    first_day
  ];

  const days_in_month = new Date(y, m, 0).getDate();

  return { days_in_month, first_day, first_day_str };
};

export { getMonthInfo };
