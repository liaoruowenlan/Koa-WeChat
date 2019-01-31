const Koa = require("koa");
const config = require("./config/config");
const wechat = require("./wechat-lib/middleware");
//此处判断用户发送过来文本，返回相对应信息。
const reply = require("./wechat/reply");

const app = new Koa();

app.use(wechat(config.wechat, reply.reply));

app.listen(config.port);
