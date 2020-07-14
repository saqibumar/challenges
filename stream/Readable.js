const { Readable } = require("stream");
// Readable streams are an abstraction for a source from which data is consumed.
class MyReadable extends Readable {
  constructor(data, options) {
    super(options);
    this.data = data;
  }

  _read(size) {
    // console.log(this.data);
    // console.log(this.data.length);
    if (this.data.length) {
      const chunk = this.data.slice(0, size);
      this.data = this.data.slice(size, this.data.length);

      this.push(chunk); // fills the buffer and emits 'readable'
    } else {
      this.push(null); // 'end'
    }
    return this.data;
  }
}

module.exports = MyReadable;
