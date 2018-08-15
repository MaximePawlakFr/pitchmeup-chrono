export default class Time {
  static async getUTCTime() {
    const now = await fetch("http://worldclockapi.com/api/json/utc/now")
      .then(response => {
        return response.json();
      })
      .then(data => {
        const fileTime = data.currentFileTime;
        const FILE_TIME_DIFF = 11644473600000;
        const now = Math.round(fileTime / 10000) - FILE_TIME_DIFF;
        return now;
      })
      .catch(err => {
        console.error(err);
      });
    return now;
  }
}
