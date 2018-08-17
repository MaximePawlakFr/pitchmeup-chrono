import firebase from "firebase";

export default class FirebaseHelper {
  static init() {
    const config = {
      apiKey: "AIzaSyBc0GR313JoZQfx2s-epTtL87n2gRFwp5U",
      authDomain: "pitchmeup-chrono.firebaseapp.com",
      databaseURL: "https://pitchmeup-chrono.firebaseio.com",
      projectId: "pitchmeup-chrono"
      //   storageBucket: "pitchmeup-chrono.appspot.com",
      //   messagingSenderId: "389398832826"
    };
    firebase.initializeApp(config);
    const firestore = firebase.firestore();
    const settings = { /* your settings... */ timestampsInSnapshots: true };
    firestore.settings(settings);
  }

  static findChrono(name, callback) {
    const firestore = firebase.firestore();
    const cleanName = name && name.length > 0 && name.trim().toLowerCase();
    if (!cleanName) {
      return;
    }
    const docRef = firestore.collection("chronos").doc(cleanName);

    const unsubscribe = docRef.onSnapshot(doc => {
      if (doc.exists) {
        console.log(doc.data());
        callback && callback(doc.data());
      } else {
        console.log("No doc: ", name, cleanName);
        callback && callback({ error: true, name: cleanName });
      }
    });
    return unsubscribe;
  }

  static setupChrono(name, startAt, duration, password) {
    const firestore = firebase.firestore();
    const publicData = {
      name,
      startAt: new firebase.firestore.Timestamp(Math.round(startAt / 1000), 0),
      duration
    };
    const privateData = {
      password
    };
    return firestore
      .collection("chronos")
      .doc(name)
      .set({ public: publicData, private: privateData })
      .then(res => { })
      .catch(err => {
        console.error(err);
      });
  }
}
