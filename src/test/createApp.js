let fs = require("fs");
let app, inFileName, inFile, testTemplate, outFileName;

if (process.argv.length < 3) {
  console.log("*** Exiting.\n    process.argv=" + process.argv + ".\n*** Usage: node createApp.js app");
  process.exit();
} else {
  app = process.argv[2];
  outFileName = "../app" + ".html";
  console.log("App: " + app);
}

try {
  testTemplate = fs.readFileSync("../../spruits/src/test/component.template.txt");
} catch (error) {
  console.log(error);
  process.exit();
}
testTemplate = testTemplate.toString().replace(/<script>/, '<script src="js/' + app + '.js"></script>\n<script>\n');
testTemplate = testTemplate.toString().replace(/#component-name#/g, app);
testTemplate = testTemplate.toString().replace(/#test-case#/, '$("body").append(spruits2.init({ screens:' + app +  '.screens, menubar:' + app + '.menubar, dropdown:' + app + '.dropdown }).$field)');

fs.writeFile(outFileName, testTemplate, (err) => err ? console.log("*** writeFile " + outFileName + " failed:\n" + err) : console.log("Wrote " + outFileName));
