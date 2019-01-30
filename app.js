const Koa = require("koa");
const config = require("./config/config");
const wechat = require("./wechat-lib/middleware");

const app = new Koa();

app.use(wechat(config.wechat));

app.listen(config.port);
