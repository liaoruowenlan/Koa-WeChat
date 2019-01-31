const mongoose = require("mongoose");
const { resolve } = require("path");
const glob = require("glob");

mongoose.Promise = global.Promise;

exports.initSchemas = () => {
  glob.sync(resolve(__dirname, "./schema", "**/*.js")).forEach(require);
};

exports.connect = db => {
  let maxConnectTimes = 0;
  return new Promise(resolve => {
    if (process.env.NODE_ENV !== "production") {
      mongoose.set("debug", true);
    }
    mongoose.connect(
      db,
      { useNewUrlParser: true }
    );
    mongoose.connection.on("disconnect", () => {
      maxConnectTimes++;
      if (maxConnectTimes > 5) {
        mongoose.connect(
          db,
          { useNewUrlParser: true }
        );
      } else {
        throw new Error("数据库挂了吧少年");
      }
      console.log("数据库挂了，骚年。");
    });
    mongoose.connection.on("error", err => {
      maxConnectTimes++;
      if (maxConnectTimes > 5) {
        mongoose.connect(
          db,
          { useNewUrlParser: true }
        );
      } else {
        throw new Error("数据库挂了吧少年");
      }
      console.log(err);
    });
    mongoose.connection.on("open", () => {
      resolve();
      console.log("Mongodb Connected!");
    });
  });
};
