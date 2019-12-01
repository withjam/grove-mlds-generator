import { readFileSync, writeFileSync, write } from "fs";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.substring(1);
}

interface APIParams {
  name: string;
  datatype: string;
}

interface APIDefinition {
  functionName: "sring";
  params?: APIParams[];
  return: {
    datatype: string;
  };
}

const TYPES = {
  boolean: "boolean",
  date: "Date",
  dateTime: "Date",
  dayTimeDuration: "string",
  decimal: "number",
  double: "number",
  float: "number",
  int: "number",
  long: "number",
  string: "string",
  time: "number",
  unsignedInt: "number",
  unsignedLong: "number",
  array: "any[]",
  object: "any",
  binaryDocument: "string",
  jsonDocument: "any",
  textDocument: "string",
  xmlDocument: "string"
};

function genArgs(params) {
  let str = "";
  if (params && params.length) {
    str += "args:{";
    str += params.map(p => `${p.name}:${TYPES[p.datatype]}`).join(",");
    str += "}";
  }
  return str;
}

function genReturn(r: { datatype: string }) {
  const t = TYPES[r.datatype];
  switch (t) {
    case "Date":
      return `return response.text().then(t => new Date(t))`;
    case "object":
      return `return response.json();`;
    case "array":
      return `return response.json() as Promise<any[]>;`;
    case "boolean":
      return `return response.json().then(j => !!j);`;
    case "number":
      return `return response.json() as Promise<number>`;
    case "string":
    default:
      return `return response.text();`;
  }
}

function genFunction(data: APIDefinition) {
  const args = genArgs(data.params);
  return `${data.functionName} = (${args}) => {
    return this.client
      .call("${data.functionName}/${data.functionName}.sjs"${
    args ? ", { params: args }" : ""
  })
      .then(response => {
        if (!response.ok) {
          throw "Invalid response";
        }
        return response.text();
      });
  }`;
}

const genRoot = (name: string, functions: any[]) => `
import { MLDSClient } from "grove-mlds-client";
export const ${capitalize(name)} = {
  on: (client: MLDSClient) => {
    return new ${capitalize(name) + "API"}(client);
  }
};
export class ${capitalize(name) + "API"} {
  client:MLDSClient;
  constructor(client: MLDSClient) {
    this.client = client;
  }
  ${functions.map(func => genFunction(func)).join("\n  ")}
}
`;

/**
 * Generates a TypeScript API definition from .api file configurations
 */
export function generateAPI(props: {
  endpointNames?: string[];
  endpointBaseURL?: string;
  apiFiles?: string[];
  clientName: string;
  outputPath: string;
}) {
  const fileData = props.apiFiles
    ? props.apiFiles.map(name => JSON.parse(readFileSync(name, "utf8")))
    : [];

  const root = genRoot(props.clientName, fileData);
  console.log(root);

  writeFileSync(props.outputPath, root, "utf8");
}
