require("dotenv").config();
const http = require("http");
const hostname = process.env.HOST; //"127.0.0.1";
const port = process.env.PORT; //3000;
const fs = require("fs");
const { Readable } = require("stream");
const MyReadable = require("./Readable");
const filePath = "./db/users.json";

const readStream = fs.createReadStream(filePath, {
  highWaterMark: 1024,
});
// const writeStream = fs.createWriteStream("users-copy.json");
// var data = [];
// 'data' - the stream is abandoned ownership of a chunk of data to a consumer.
readStream.on("data", (chunk) => {
  /* writeStream.write(
    `\n\n*********** new chunk has been received: ***********\n\n${chunk}`
  ); */
});
var data = fs.createReadStream(filePath, { flags: "r", encoding: "utf-8" });
// var data = [{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }, { e: 5 }];
const readable = new MyReadable(data, {
  objectMode: true,
  highWaterMark: 2,
});
/** Consuming Readable Stream **/
console.log(readable.readableFlowing); // null
// flowing mode - no buffering - can float the memory
// listening to 'data' event calls _read() that will fill the buffer
readable.on("data", (chunk) => {
  console.log(chunk);
});
console.log(readable.readableFlowing); // true
// pause mode
readable.on("readable", () => {
  readable.read(); // calls _read(), flushes the buffer and emits 'data' event
});
console.log(readable.readableFlowing); // false

readable.on("end", () => console.log("No more data!"));

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

server.on("request", (req, res) => {
  // const src = fs.createReadStream(filePath);
  var src = fs.createReadStream(filePath, { flags: "r", encoding: "utf-8" });
  src.pipe(res);
  fs.readFile(filePath, (err, data) => {
    console.log("REQUESTING FILE", data.toString());
    if (err) throw err;
    res.end(data);
  });
});
