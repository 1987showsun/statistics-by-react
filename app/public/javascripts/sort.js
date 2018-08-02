export function sort(data, sortKey, sortStatus) {
  let reSortData = [];
  sortStatus = sortStatus || 0;
  if (sortKey) {
    switch (sortStatus) {
      case 0:
        reSortData = data.sort((a, b) => {
          return a["id"] < b["id"];
        });
        break;

      case 1:
        reSortData = data.sort((a, b) => {
          return a[sortKey] < b[sortKey];
        });
        break;

      default:
        reSortData = data.sort((a, b) => {
          return a[sortKey] > b[sortKey];
        });
    }
  } else {
    reSortData = data;
  }

  return {
    reSortData: reSortData
  };
}
