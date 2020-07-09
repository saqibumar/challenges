'use strict';

const controller = require('./user.controller');

module.exports = Router => {
  const router = new Router({
    prefix: `/users`,
  });

  router
    .get('/:userId', controller.getOne)
    .get('/', controller.getAll)
    //.get('/?masking=123', controller.getAllFiltered)
    .post('/', controller.createOne);

  return router;
};
