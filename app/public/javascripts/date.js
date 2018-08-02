export function changeDate(ms) {
  if (ms != 0) {
    const date = new Date(ms);
    let YYYY = date.getFullYear();
    let MM =
      String(date.getMonth() + 1).length < 2
        ? `0${String(date.getMonth() + 1)}`
        : String(date.getMonth() + 1);
    let DD =
      String(date.getDate()).length < 2
        ? `0${String(date.getDate())}`
        : String(date.getDate());
    let HH =
      String(date.getHours()).length < 2
        ? `0${String(date.getHours())}`
        : String(date.getHours());
    let Min =
      String(date.getMinutes()).length < 2
        ? `0${String(date.getMinutes())}`
        : String(date.getMinutes());
    let SS =
      String(date.getSeconds()).length < 2
        ? `0${String(date.getSeconds())}`
        : String(date.getSeconds());
    return `${YYYY}-${MM}-${DD} ${HH}:${Min}:${SS}`;
  } else {
    return `YYYY-MM-DD`;
  }
}

export function changeDateNoTime(ms) {
  if (ms != 0) {
    const date = new Date(ms);
    let YYYY = date.getFullYear();
    let MM =
      String(date.getMonth() + 1).length < 2
        ? `0${String(date.getMonth() + 1)}`
        : String(date.getMonth() + 1);
    let DD =
      String(date.getDate()).length < 2
        ? `0${String(date.getDate())}`
        : String(date.getDate());
    let HH =
      String(date.getHours()).length < 2
        ? `0${String(date.getHours())}`
        : String(date.getHours());
    let Min =
      String(date.getMinutes()).length < 2
        ? `0${String(date.getMinutes())}`
        : String(date.getMinutes());
    let SS =
      String(date.getSeconds()).length < 2
        ? `0${String(date.getSeconds())}`
        : String(date.getSeconds());
    return `${YYYY}-${MM}-${DD}`;
  } else {
    return `YYYY-MM-DD`;
  }
}

export function getDate() {
  let back_month = 1; //回朔幾個月前

  const startDate = new Date();
  let startDate_YYYY = startDate.getFullYear();
  let startDate_MM =
    String(startDate.getMonth() + 1).length < 2
      ? `0${String(startDate.getMonth() + 1)}`
      : String(startDate.getMonth() + 1);
  let startDate_DD =
    String(startDate.getDate()).length < 2
      ? `0${String(startDate.getDate())}`
      : String(startDate.getDate());

  let Look_back_MM = startDate.getMonth() - back_month;

  const endDate = new Date(startDate_YYYY, Look_back_MM, startDate_DD);
  let endDate_YYYY = endDate.getFullYear();
  let endDate_MM =
    String(endDate.getMonth() + 1).length < 2
      ? `0${String(endDate.getMonth() + 1)}`
      : String(endDate.getMonth() + 1);
  let endDate_DD =
    String(endDate.getDate()).length < 2
      ? `0${String(endDate.getDate())}`
      : String(endDate.getDate());

  return {
    endDate: `${startDate_YYYY}-${startDate_MM}-${startDate_DD}`,
    startDate: `${endDate_YYYY}-${endDate_MM}-${endDate_DD}`
  };
}

export function changeMs(val) {
  const date = new Date(val);
  const ms = date.valueOf();
  return ms;
}
