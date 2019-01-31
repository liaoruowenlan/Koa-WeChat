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
  async fetchAccessToken() {
    let data;
    if (this.getAccessToken) {
      data = await this.getAccessToken();
    }
    if (!this.isValidToken(data)) {
      data = await this.updateAccessToken();
    }
    return data;
  }
  //修改请求token时间。返回新的数据。
  async updateAccessToken() {
    const url = `${api.accessToken}&appid=${this.appID}&secret=${
      this.appSecret
    }`;
    const data = await this.request({ url });
    console.log(data);
    const now = new Date().getTime();
    const expiresIn = now + (data.expires_in - 20) * 1000;
    data.expires_in = expiresIn;
    console.log(data);
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
