require('dotenv').config();
const IO = require('koa-socket-2');

const Koa = require('koa');
const serve = require('koa-better-static2');
const config = require('./config');
const bouncer = require('koa-bouncer');
const mw = require('./mw');
const nunjucksRender = require('koa-nunjucks-async');

const app = new Koa();
const io = new IO();
app.poweredBy = false;
app.proxy = true;

const nunjucksOptions = {
  ext: '.html',
  noCache: false,
  throwOnUndefined: false,
  filters: { json: x => JSON.stringify(x, null, '  ') }
};

app.use(require('koa-helmet')());
app.use(require('koa-compress')());
app.use(serve('public'));
if (process.env.NODE_ENV !== 'production') {
  app.use(require('koa-logger')());
}
app.use(
    require('koa-bodyparser')({
      extendTypes: { json: ['text/plain'] },
      enableTypes: ['json'],
      onerror(err, ctx) {
        ctx.throw(422, JSON.stringify({ error: 'Error parsing request', err }));
      }
    })
);
app.use(mw.methodOverride());
app.use(mw.removeTrailingSlash());
app.use(bouncer.middleware());
app.use(mw.handleBouncerValidationError());
app.use(nunjucksRender('views', nunjucksOptions));
const router = require('./router');
app.use(router.routes());
app.use(router.allowedMethods());
io.attach(app);
app._io.on('connection', sock => {
  console.log(sock.id, 'connected');
    // require('./socket').open(sock);
});

app.start = (port = config.PORT) => {
  app.listen(8337, '0.0.0.0', () => {
    console.log('Listening on port', 8337);
  });
};
module.exports = app;
