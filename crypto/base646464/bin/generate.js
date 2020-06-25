const btoa = str => Buffer.from(str).toString('base64');

const fs = require("fs");
const flag = fs.readFileSync("flag.txt", "utf8").trim();

let ret = flag;
for(let i = 0; i < 25; i++) ret = btoa(ret);

fs.writeFileSync("cipher.txt", ret);
