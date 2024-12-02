function getLastDateOfMonth(year, month) {
  // Month is 0-indexed (January is 0, December is 11)
  return new Date(year, month + 1, 0); // Set day to 0 of the next month
}

function getFirstDateOfMonth(year, month) {
  // Month is 0-indexed (January is 0, December is 11)
  return new Date(year, month, 1);
}

export { getLastDateOfMonth, getFirstDateOfMonth };
