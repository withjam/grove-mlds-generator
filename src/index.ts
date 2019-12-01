import { generateAPI } from "./generator";

class Startup {
  public static main(): number {
    console.log("MLDS Generator");
    generateAPI({
      clientName: "GenTest",
      apiFiles: ["tests/api/whatsUp.api"],
      outputPath: "tests/GenTest.ts"
    });
    return 0;
  }
}

Startup.main();
