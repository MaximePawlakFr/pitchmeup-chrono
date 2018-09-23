import NoSleep from "nosleep.js/dist/NoSleep";

class NoSleepHelper {
  static noSleep = new NoSleep();

  static enable() {
    NoSleepHelper.noSleep.enable();
  }

  static disable() {
    NoSleepHelper.noSleep.disable();
  }
}

export default NoSleepHelper;
