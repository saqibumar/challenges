require("dotenv").config();
const http = require("http");
const hostname = process.env.HOST; //"127.0.0.1";
const port = process.env.PORT; //3000;
const fs = require("fs");
const { Readable } = require("stream");
const MyReadable = require("./Readable");
const filePath = "./db/users.json";
var url = require("url");

const server = http.createServer((req, res) => {});
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

server.on("request", (req, res) => {
  var url_string = req.url;
  console.log(req.method);
  console.log(url_string);
  var queryData = url.parse(url_string, true).query;
  const phone = encodeURIComponent(queryData.masking).replace("%20", "+");
  console.log(phone);
  /* console.log(
    ">>>>>>>>>>>>>>" +
      /([/api/v1/users/?masking=])$/.test("/api/v1/users/?masking=")
  ); */
  if (
    req.method === "GET" &&
    req.url.indexOf("/api/v1/users?masking=") !== -1
  ) {
    console.log("Correct method called");
    // req.pipe(res);
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/json");
  } else {
    console.log("404");
    res.statusCode = 404;
    // res.end(res.statusCode);
  }
  if (res.statusCode !== 404) {
    const users = require(filePath);
    const clone = JSON.parse(JSON.stringify(users));
    let filtered_users = clone.filter((item) => {
      if (item.phone == phone) {
        let cc = item.phone.substring(0, 2);
        let masked = item.phone
          .substring(cc.length + 2, item.phone.length - 3)
          .replace(new RegExp("[0-9]", "g"), "*");
        let nums = item.phone.substring(masked.length + 3, item.phone.length);
        item.phone = cc + masked + nums;
        return true;
      }
    });
    const readable = new MyReadable(filtered_users, {
      objectMode: true,
      highWaterMark: 2,
    });
    /** Consuming Readable Stream **/
    console.log(readable.readableFlowing); // null
    // flowing mode - no buffering - can float the memory
    // listening to 'data' event calls _read() that will fill the buffer
    readable.on("data", (chunk) => {
      // console.log(chunk);
      //res.statusCode = 200;
      //res.setHeader("Content-Type", "text/json");
      res.write(JSON.stringify(chunk));
    });
    console.log(readable.readableFlowing); // true
    // pause mode
    // let data = [];
    // let data_str = "";
    readable.on("readable", () => {
      readable.read(); // calls _read(), flushes the buffer and emits 'data' event
      // console.log(data);
      // data_str = JSON.stringify(data);
      // res.end(data_str);
    });
    console.log(readable.readableFlowing); // false

    readable.on("end", () => {
      console.log("No more data!");

      // setTimeout(() => {
      res.end();
      // }, 0);
      // console.log(data_str);
    });
    /* const { headers, method, url } = req;
    let body = [];
    req
      .on("error", (err) => {
        console.error(err);
      })
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        const responseBody = { headers, method, url, body, data };
        body = Buffer.concat(body).toString();
        console.log(data);
        // At this point, we have the headers, method, url and body, and can now
        // do whatever we need to in order to respond to this request.
        res.setHeader("Content-Type", "application/json");
        //res.setHeader("Content-Type", "text/plain");
        // res.setHeader("Content-Type", "text/html");
        res.setHeader("X-Powered-By", "bacon");
        res.statusCode = 200;
        // res.write(body);
        res.write("<html>");
        res.write("<body>");
        res.write(body);
        res.write("<h1>------------->Hello, World!</h1>");
        res.write("</body>");
        res.write("</html>");
        res.write(JSON.stringify(responseBody));
        res.end();
      }); */
  } else {
    res.end();
  }
});
