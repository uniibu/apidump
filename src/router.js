const Router = require('koa-router');
const config = require('./config');
const router = new Router();

function parseJsonToStr(obj) {
  let str = '';
  if (!obj) {
    return `${str}\n`;
  }
  for (const [k, v] of Object.entries(obj)) {
    str += `${k}: ${v}\n`;
  }
  return str;
}
router.get('/', async ctx => {
  await ctx.render('main', { apiurl: config.URL });
});
router.all('/api/:user', ctx => {
  ctx.validateParam('user').isString().trim();
  const socketid = ctx.vals.user;
  const socket = ctx.app.io.socket;
  const b = `
--General--
Request URL: ${config.URL + ctx.request.url}
Request Method: ${ctx.request.method}

--Headers--
${parseJsonToStr(ctx.request.headers)}
--Query Parameters--
${parseJsonToStr(ctx.request.query)}
--Body Parameters--
${parseJsonToStr(ctx.request.body)}

`;
  socket.to(socketid).emit('result', b);
  ctx.body = 'ok';
});
module.exports = router;