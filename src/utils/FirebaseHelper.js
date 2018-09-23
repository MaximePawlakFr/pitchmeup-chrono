import firebase from "firebase";
import config from "../config";
import types from "./types";

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

  static findAndCheckChrono(name, password) {
    const firestore = firebase.firestore();
    const docRef = firestore.collection(types.COLLECTIONS.CHRONOS).doc(name);

    return docRef.get().then(doc => {
      if (doc.exists) {
        if (doc.data().private.password !== password) {
          throw new Error(
            "This named chrono already exists and this password doesn't match. Please, select anoter name or contact the chrono administrator to get the right password."
          );
        }
      }
    });
  }

  static setupChrono(data) {
    data.public.startAt = new firebase.firestore.Timestamp(
      Math.round(data.public.startAt / 1000),
      0
    );

    const firestore = firebase.firestore();
    const { name } = data.public;
    const { password } = data.private;
    return FirebaseHelper.findAndCheckChrono(name, password).then(() => {
      return firestore
        .collection(types.COLLECTIONS.CHRONOS)
        .doc(name)
        .set(data);
    });
  }

  static startChrono(name, password) {
    const firestore = firebase.firestore();
    const publicData = { status: types.CHRONO_STATUS.STARTED };
    const privateData = { password };
    return firestore
      .collection(types.COLLECTIONS.CHRONOS)
      .doc(name)
      .set({ public: publicData, private: privateData }, { merge: true });
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

  static setChronoOnSnapshot(name, callback) {
    const firestore = firebase.firestore();
    const unsubscribe = firestore
      .collection("chronos")
      .doc(name)
      .onSnapshot(doc => {
        console.log("Changes", doc);
        if (doc.exists) {
          callback && callback(doc.data());
        } else {
          console.log("No doc: ", name);
          callback && callback({ error: true, name });
        }
      });

    return unsubscribe;
  }
}
