const Koa = require("koa");
const config = require("./config/config");
const wechat = require("./wechat-lib/middleware");
const reply = require("./wechat/reply");

const app = new Koa();

app.use(wechat(config.wechat, reply.reply));

app.listen(config.port);
