const sha1 = require("sha1");
const getRawBody = require("raw-body");
const util = require("./util");
module.exports = (config, reply) => {
  return async (ctx, next) => {
    const { signature, timestamp, nonce, echostr } = ctx.query; //获取微信返回数据。
    const token = config.token; //获取微信平台中配置的token。
    let str = [token, timestamp, nonce].sort().join(""); //获取微信返回数据并生成str。
    const sha = sha1(str); //对str进行加密。
    if (ctx.method === "GET") {
      if (sha === signature) {
        ctx.body = echostr;
      } else {
        ctx.body = "Failed";
      }
    } else if (ctx.method === "POST") {
      if (sha !== signature) {
        return (ctx.body = "Failed");
      }
      const data = await getRawBody(ctx.req, {
        length: ctx.length,
        limit: "1mb",
        encoding: ctx.charset
      });

      const content = await util.parseXML(data);

      const message = util.formatMessage(content.xml);

      ctx.weixin = message;
      await reply.apply(ctx, [ctx, next]);

      ctx.status = 200;
      ctx.type = "application/xml";
      const replyBody = ctx.body;
      //获取微信传递过来的数据。
      const msg = ctx.weixin;
      //渲染模板引擎。
      const xml = util.tpl(replyBody, msg);
      ctx.body = xml;
    }
  };
};
