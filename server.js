const Koa = require("koa");

const app = new Koa();

// try edit me while server running
app.use(async (ctx) => {
  ctx.body = "hello, world!";
});

module.exports = app;
