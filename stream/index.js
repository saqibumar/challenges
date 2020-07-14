const Koa = require("koa");
const app = new Koa();
const http = require("http");
// logger

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get("X-Response-Time");
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
  console.log("DATE", ms);
});

// response

app.use(async (ctx) => {
  ctx.body = "Hello WorldX";
  console.log("BODY");
});

app.listen(3000);
