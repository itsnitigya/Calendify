module.exports = (req, res, next) => {
  res.sendError = (err, msg = "Internal Error") => {
    err && console.log("[ERROR] ", err);
    res.send({
      success: false,
      msg,
    });
  };
  res.sendSuccess = (data, msg) => {
    res.send({
      success: true,
      msg,
      ...(data && {
        data,
      }),
    });
  };
  next();
};
