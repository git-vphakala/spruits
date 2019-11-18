let fs = require("fs");
let cssVersion, outFileName, outFile;

cssVersion = "2018.9";
outFileName = "../spruits-" + cssVersion + ".css";

// css files are handled in this order
let comps = [
  "head",
  "PageManager",
  "Menu",
  "Select",
  "Calendar",
  "Spinner",
  "TimePicker",
  "InputTime",
  "InputCheckbox",
  "Table",
  "Modal",
  "TabSheet",
  "Crud",
  "Notification",
  "tail"
];

fs.writeFile(outFileName, "/* " + outFileName.slice(3) + ", generated " + new Date().toISOString() + " */\n", (err) => {
  if (err) {
    console.log("*** writeFile " + outFileName + " failed:\n" + err)
  } else {

    outFile = fs.createWriteStream(outFileName, { flags:'a' });
    comps.forEach((comp, index) => {
      let inFileName = "./" + comp + ".css", compCss = fs.readFileSync(inFileName);
      outFile.write(compCss);
      console.log("Reading " + inFileName);
    });
    console.log("Wrote " + outFileName);
    
  }
});
