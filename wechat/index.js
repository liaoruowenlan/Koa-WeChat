const Wechat = require("../wechat-lib");
const config = require("../config/config");

const wechatCfg = {
  wechat: {
    appID: config.wechat.appID,
    appSecret: config.wechat.appsecret,
    token: config.wechat.token
  }
};

(async function() {
  new Wechat(wechatCfg.wechat);
})();
