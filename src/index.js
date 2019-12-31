#!/usr/bin/env node

const glob = require("fast-glob");
const generator = require("./generator");

// generateAPI({
//   clientName: "GenTest",
//   apiFiles: [
//     "tests/api/whatsUp.api",
//     "tests/api/numberTest.api",
//     "tests/api/arrayTest.api",
//     "tests/api/dateTest.api",
//     "tests/api/docTest.api"
//   ],
//   outputPath: "tests/GenTest.ts"
// });
// generateAPI({
//   clientName: "HelloClient",
//   apiFiles: ["tests/api/whatsUp.api"],
//   outputPath: "tests/HelloClient.js",
//   outputFormat: OUTPUT_FORMATS.JS
// });

const argv = require("yargs")
  .usage("Usage: $0 <command> [options]")
  .command(["generate [name]", "generate", "g"], "Generate a client file", {
    handler: generate,
    builder: _ =>
      _.default("name", "MLDSClientGenerated")
        .option("f", {
          alias: "files",
          describe: "read from api file(s) - comma separated",
          nargs: 1,
          demand: true,
          demand: "At least one .api file is required"
        })
        .option("o", {
          alias: "output",
          describe: "Output file path",
          nargs: 1,
          demand: true,
          demand: "Must specify output file"
        })
        .option("t", {
          alias: "format",
          describe: "Output format [js|ts]",
          nargs: 1,
          demand: false,
          default: "ts"
        })
  })
  .demandCommand(1, "You must specify at least one command").argv;

function generate({ files, name, output, format }) {
  console.log("generate with args", files, format, output, name);
  const filePatterns = files.split(",");
  const inputs = filePatterns.flatMap(pattern => {
    const r = glob.sync(pattern, { onlyFiles: true });
    console.log("glob found", r);
    return r;
  });
  console.log("inputs", inputs);
  generator.generateAPI({
    clientName: name,
    apiFiles: inputs,
    outputPath: output,
    outputFormat:
      format === "ts"
        ? generator.OUTPUT_FORMATS.ts
        : generator.OUTPUT_FORMATS.js
  });
}
