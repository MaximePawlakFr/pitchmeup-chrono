export default {
  timezonedbURL:
    "https://api.timezonedb.com/v2/get-time-zone?key=8TEB60HMLFTK&by=zone&zone=Europe/Paris&format=json",
  firebase: {
    apiKey: "AIzaSyBc0GR313JoZQfx2s-epTtL87n2gRFwp5U",
    authDomain: "pitchmeup-chrono.firebaseapp.com",
    databaseURL: "https://pitchmeup-chrono.firebaseio.com",
    projectId: "pitchmeup-chrono"
    //   storageBucket: "pitchmeup-chrono.appspot.com",
    //   messagingSenderId: "389398832826"
  },
  chrono: {
    default: [{ minutes: 5, seconds: 0 }, { minutes: 10, seconds: 0 }]
  }
};
