function lastNumDays(num: number) {
  const today = new Date();
  const lastNDays: Record<string, number> = {};
  if (num >= 0) {
    for (let i = num; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split("T")[0];
      lastNDays[key] = 0;
    }
  } else {
    for (let i = num; i <= 0; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split("T")[0];
      lastNDays[key] = 0;
    }
  }
  return lastNDays;
}

function createRangeOptions() {
  const rangeOptions = [];

  for (let i = -60; i <= 60; i += 15) {
    if (i != 0) {
      rangeOptions.push({
        start: i,
        end: i + 15,
        label: `${i < 0 ? Math.abs(i) + " days ahead" : i + " days ago"}`,
      });
    }
  }
  return rangeOptions;
}

export { lastNumDays, createRangeOptions };
