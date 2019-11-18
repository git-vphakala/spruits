let fs = require("fs");
let comp, inFileName, inFile, testTemplate, outFileName;

if (process.argv.length < 3) {
  console.log("*** Exiting.\n    process.argv=" + process.argv + ".\n*** Usage: node createAppTest.js app");
  process.exit();
} else {
  comp = process.argv[2];
  // inFileName = "./test." + comp + ".js";
  outFileName = "../../components/test/test." + comp + ".html";
  console.log("App:" + comp); // + ". Reading:" + inFileName);
}
/*
try {
  inFile = fs.readFileSync(inFileName);
} catch (error) {
  console.log(error);
  process.exit();
}
*/
try {
  testTemplate = fs.readFileSync("component.template.txt");
} catch (error) {
  console.log(error);
  process.exit();
}
testTemplate = testTemplate.toString().replace(/<script>/, '<script src="js/' + comp + '.js"></script>\n<script>\n');
testTemplate = testTemplate.toString().replace(/#component-name#/g, comp);
testTemplate = testTemplate.toString().replace(/#test-case#/, '$("body").append(spruits2.init({ screens:' + comp +  '.screens, menubar:' + comp + '.menubar, dropdown:' + comp + '.dropdown }).$field)');

fs.writeFile(outFileName, testTemplate, (err) => err ? console.log("*** writeFile " + outFileName + " failed:\n" + err) : console.log("Wrote " + outFileName));
