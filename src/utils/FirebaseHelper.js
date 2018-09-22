import firebase from "firebase";
import config from "../config";

export default class FirebaseHelper {
  static init() {
    firebase.initializeApp(config.firebase);
    const firestore = firebase.firestore();
    const settings = { /* your settings... */ timestampsInSnapshots: true };
    firestore.settings(settings);
  }

  static cleanName(name) {
    const newName = name && name.length > 0 && name.trim().toLowerCase();
    if (!newName) {
      return;
    }
    return newName;
  }

  static findChrono(name, callback, args) {
    console.log("findChrono", name);
    const cleanName = this.cleanName(name);

    const firestore = firebase.firestore();
    const docRef = firestore.collection("chronos").doc(cleanName);

    return docRef
      .get()
      .then(doc => {
        console.log("get", doc);

        if (doc.exists) {
          console.log(doc.data());
          callback && callback({ document: doc.data(), ...args });
        } else {
          console.log("No doc: ", name, cleanName);
          callback && callback({ error: true, name: cleanName });
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
  }

  static setupChrono(name, startAt, duration, password) {
    console.log("setupChrono", name);
    const cleanName = this.cleanName(name);

    const firestore = firebase.firestore();
    const publicData = {
      cleanName,
      startAt: new firebase.firestore.Timestamp(Math.round(startAt / 1000), 0),
      duration,
      status: "CREATED"
    };
    const privateData = {
      password
    };
    return firestore
      .collection("chronos")
      .doc(cleanName)
      .set({ public: publicData, private: privateData })
      .then(res => {})
      .catch(err => {
        console.error(err);
      });
  }

  static startChrono(name, password) {
    console.log("startChrono", name);
    const cleanName = this.cleanName(name);

    const firestore = firebase.firestore();
    const publicData = { status: "STARTED" };
    const privateData = { password };
    return firestore
      .collection("chronos")
      .doc(cleanName)
      .set({ public: publicData, private: privateData }, { merge: true })
      .then(res => {})
      .catch(err => {
        console.error(err);
      });
  }

  static stopChrono(name, password) {
    const firestore = firebase.firestore();
    const publicData = { status: "STOPPED" };
    const privateData = { password };
    const cleanName = this.cleanName(name);

    return firestore
      .collection("chronos")
      .doc(cleanName)
      .set({ public: publicData, private: privateData }, { merge: true })
      .then(res => {})
      .catch(err => {
        console.error(err);
      });
  }

  static setChronoOnSnapshot(name, callback, args) {
    console.log("setChronoOnSnapshot", name, args);
    const cleanName = this.cleanName(name);

    const firestore = firebase.firestore();
    const unsubscribe = firestore
      .collection("chronos")
      .doc(cleanName)
      .onSnapshot(doc => {
        console.log("Changes", doc);
        if (doc.exists) {
          callback && callback({ document: doc.data(), ...args });
        } else {
          console.log("No doc: ", cleanName);
          callback && callback({ error: true, name });
        }
      });

    return unsubscribe;
  }
}
