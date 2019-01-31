const request = require("request-promise");
const base = "https://api.weixin.qq.com/cgi-bin/";
const api = {
  accessToken: base + "token?grant_type=client_credential"
};
//声明一个wechat类。 接受实例化时传入的参数。
module.exports = class Wechat {
  constructor(opts) {
    this.opts = Object.assign({}, opts);
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;
    //默认发出token请求。
    this.fetchAccessToken();
  }
  async request(options) {
    options = Object.assign({}, options, { json: true });
    try {
      const res = await request(options);
      return res;
    } catch (err) {
      console.log(err);
    }
  }
  //发送请求时拼接id。secret的url地址。
  //首先检查数据库里的token是否过期。
  //过期则刷新。
  //token入库。
  async fetchAccessToken() {
    let data = await this.getAccessToken();
    if (!this.isValidToken(data)) {
      data = await this.updateAccessToken();
    }
    //存储token。
    await this.saveAccessToken(data);
    return data;
  }
  //获取token
  async updateAccessToken() {
    const url = `${api.accessToken}&appid=${this.appID}&secret=${
      this.appSecret
    }`;
    const data = await this.request({ url });
    const now = new Date().getTime();
    const expiresIn = now + (data.expires_in - 20) * 1000;
    data.expires_in = expiresIn;
    return data;
  }
  isValidToken(data) {
    if (!data || data.expires_in) {
      return false;
    }
    const expiresIn = data.expires_in;
    const now = new Date().getTime();
    return now < expiresIn;
  }
};
