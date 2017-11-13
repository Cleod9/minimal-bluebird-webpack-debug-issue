var Promise = require('bluebird');

Promise.resolve()
  .then(function () {
    console.log('Done.');
  });
