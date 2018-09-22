import config from "../config";

export default class Time {
  static async getUTCTime() {
    const now = await fetch(config.timezonedbURL)
      .then(response => {
        return response.json();
      })
      .then(data => {
        const now = (data.timestamp - data.gmtOffset) * 1000;
        return now;
      })
      .catch(err => {
        console.error(err);
      });
    return now;
  }
}
