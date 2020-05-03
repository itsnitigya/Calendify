//this is helper function to support res.sendSuccess and res.sendError on http methods 

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
