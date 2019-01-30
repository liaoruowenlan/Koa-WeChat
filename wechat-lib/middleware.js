const sha1 = require("sha1");
const getRawBody = require("raw-body");
const util = require("./util");
module.exports = config => {
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

      ctx.status = 200;
      ctx.type = "application/xml";
      const xml = `<xml>
      <ToUserName>
        <![CDATA[${message.FromUserName}]]>
      </ToUserName> 
      <FromUserName>
        <![CDATA[${message.ToUserName}]]>
      </FromUserName>
       <CreateTime>
        ${parseInt(new Date().getTime() / 1000, 0)}
      </CreateTime> 
       <MsgType>
        <![CDATA[text]]>
       </MsgType> 
       <Content>
        <![CDATA[${message.Content}]]>
       </Content>
       </xml>`;
      console.log(xml, "xml");
      ctx.body = xml;
    }
  };
};
