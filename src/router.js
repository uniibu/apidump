const Router = require('koa-router');

const config = require('./config');

const router = new Router();

router.get('/', async ctx => {
  await ctx.render('main', { apiurl: config.URL });
});
router.all('/api/:user', ctx => {
  ctx.validateParam('user').isString().trim();
  const socketid = ctx.vals.user;
  const socket = ctx.app.io.socket;
  let b = JSON.stringify(ctx.request, null, 2);
  if (Object.keys(ctx.request.body).length) {
    b = b + JSON.stringify(ctx.request.body, null, 2);
  }
  socket.to(socketid).emit('result', b);
  ctx.body = 'ok';
});
module.exports = router;
