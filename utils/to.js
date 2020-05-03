//this is a helper funtion that converts promises to an object s

module.exports = to = promise => {
  return promise
    .then(data => {
      return [null, data];
    })
    .catch(err => [err]);
};
