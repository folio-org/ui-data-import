export function sortStrings(a, b) {
  const valA = a.toUpperCase();
  const valB = b.toUpperCase();

  if (valA < valB) {
    return -1;
  }

  if (valA > valB) {
    return 1;
  }

  return 0;
}

export function sortDates(a, b) {
  const valA = new Date(a);
  const valB = new Date(b);

  return valA - valB;
}

export function sortNums(a, b) {
  return a - b;
}
