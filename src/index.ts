import { generateAPI } from "./generator";

class Startup {
  public static main(): number {
    console.log("MLDS Generator");
    generateAPI({
      clientName: "GenTest",
      apiFiles: ["sample.api", "whatsUp.api"],
      outputPath: "GenTest.ts"
    });
    return 0;
  }
}

Startup.main();
