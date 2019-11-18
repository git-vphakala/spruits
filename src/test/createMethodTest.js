let fs = require("fs");
let comp, method, inFileName, inFile, testFileHead, testFileTail, outFileName;

if (process.argv.length < 4) {
  console.log("*** Exiting.\n    process.argv=" + process.argv + ".\n*** Usage: node createMethodTest.js component method");
  process.exit();
} else {
  comp = process.argv[2];
  method = process.argv[3];
  inFileName = "./test." + comp + "." + method + ".js";
  outFileName = "../../components/test/test." + comp + "." + method + ".html";
  console.log("Component:" + comp + ". Method:" + method + ". Reading:" + inFileName);
}
try {
  inFile = fs.readFileSync(inFileName); // openSync(inFileName, "r");
} catch (error) {
  console.log(error);
  process.exit();
}
try {
  testFileHead = fs.readFileSync("head.methodtest.txt");
} catch (error) {
  console.log(error);
  process.exit();
}
testFileHead = testFileHead.toString().replace(/#method-name#/g, method);
testFileHead = testFileHead.toString().replace(/#component-name#/g, comp);
try {
  testFileTail = fs.readFileSync("tail.methodtest.txt");
} catch (error) {
  console.log(error);
  process.exit();
}
fs.writeFile(outFileName, testFileHead + inFile + testFileTail, (err) => err ? console.log("*** writeFile " + outFileName + " failed:\n" + err) : console.log("Wrote " + outFileName));
