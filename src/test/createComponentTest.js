let fs = require("fs");
let comp, inFileName, inFile, testTemplate, outFileName, argvI, s, scripts="";

if (process.argv.length < 3) {
  console.log("*** Exiting.\n    process.argv=" + process.argv + ".\n*** Usage: node createComponentTest.js component [ -script scriptFileName ] [ -manifest ]");
  process.exit();
} else {
  comp = process.argv[2];
  inFileName = "./test." + comp + ".js";
  outFileName = "../../components/test/test." + comp + ".html";
  console.log("Component:" + comp + ". Reading:" + inFileName);

  if (process.argv.length > 3) {
    for (argvI = 3; argvI < process.argv.length; ) {
      if (process.argv[argvI] === "-script") {
	if (argvI+1 < process.argv.length) {
	  s = '<script src="js/' + process.argv[argvI+1] + '"></script>';
	  console.log("Adding: " + s);
	  scripts += s;
	} else {
	  console.log("*** Exiting. argvI=" + argvI + ", process.argv[argvI] = " + process.argv[argvI] + ". Missing script file name.");
	  process.exit();
	}
	argvI += 2;
      } else if (process.argv[argvI] === "-manifest") {
	s = '<link rel="manifest" href="manifest.json">';
	console.log("Adding: " + s);
	scripts += s;
	argvI += 1;
      }
    }
  }
}
try {
  inFile = fs.readFileSync(inFileName);
} catch (error) {
  console.log(error);
  process.exit();
}
try {
  testTemplate = fs.readFileSync("component.template.txt");
} catch (error) {
  console.log(error);
  process.exit();
}
testTemplate = testTemplate.toString().replace(/#component-name#/g, comp);
testTemplate = testTemplate.toString().replace(/#test-case#/, inFile);
if (scripts.length) {
  testTemplate = testTemplate.toString().replace("</title>", ("</title>" + scripts));
}

fs.writeFile(outFileName, testTemplate, (err) => err ? console.log("*** writeFile " + outFileName + " failed:\n" + err) : console.log("Wrote " + outFileName));
