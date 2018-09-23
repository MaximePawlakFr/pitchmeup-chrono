class ChronoError extends Error {
  constructor(error) {
    super(error.message);
    this.name = "ChronoError";
    this.type = error.type;
  }
}

export default ChronoError;
