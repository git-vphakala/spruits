let fs = require("fs");
let className, inFileName, outFileName;

if (process.argv.length < 3) {
  console.log("*** Exiting. process.argv=" + process.argv);
  process.exit();
} else {
  className = process.argv[2];
  inFileName = "./" + className + ".js";
  outFileName = "../components/" + className + ".js";
  console.log("Reading " + inFileName);
}

const createdClass = require("./" + className + ".js");

// console.log("createdClass=" + JSON.stringify(createdClass));

//****************************************************************************************************************************************************************************
// createClass
function createClass(className, args, props, methods, init, interfaceFuncs, interfaceProps) {
  let classSrc = [], ifs = [];

  classSrc.push("let\n" + 
		(args ? args.map(v => v + " = args." + v) + ",\n" : "") + 
		(props ? props + ",\n" : "") + 
		(methods ? Object.entries(methods).map(nameAndBody => nameAndBody[0]) + "," : "") + "init,\n" +
		Object.entries(interfaceFuncs).map(nameAndBody => nameAndBody[0]) +
		";\n"
	       );

  if (methods) Object.entries(methods).forEach( nameAndBody => { 
    let re = new RegExp("function " + nameAndBody[0]); 
    classSrc.push(nameAndBody[0] + nameAndBody[1].toString().replace(re, " = function") + ";\n") 
  });

  classSrc.push(init.toString().replace("function init()", "init = function(that)").replace(/this/g, "that") + ";\ninit(this);\n");

  Object.entries(interfaceFuncs).forEach( nameAndBody => { 
    let re = new RegExp("function " + nameAndBody[0]); 
    ifs.push(nameAndBody[0]);
    classSrc.push(nameAndBody[0] + nameAndBody[1].toString().replace(re, " = function") + ";\n") 
  });

  if (interfaceProps) interfaceProps.forEach(p => classSrc.push("this." + p + " = " + p + ";\n"));
  ifs.forEach(f => classSrc.push("this." + f + " = " + f + ";\n"));

  return className + " = function(args) {\n" + classSrc.reduce((src, line) => src + line) + "};\n";
  //return classSrc.reduce((src, line) => src + line);
}
//****************************************************************************************************************************************************************************

let testSrc = createClass(
  createdClass.className,
  createdClass.args,
  createdClass.props,
  createdClass.methods,
  createdClass.init,
  createdClass.interfaceFuncs,
  createdClass.interfaceProps
);
fs.writeFile(outFileName, testSrc, (err) => err ? console.log("*** writeFile " + outFileName + " failed:\n" + err) : console.log("Wrote " + outFileName));

