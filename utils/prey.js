const prey = (handler) => (req, res, next) => {
  handler(req, res, next).catch(next);
}

export default prey;
