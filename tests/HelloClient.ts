
import { MLDSClient } from "grove-mlds-client";
export const HelloClient = {
  on: (client: MLDSClient) => {
    return new HelloClientAPI(client);
  }
};
export class HelloClientAPI {
  protected client:MLDSClient;
  constructor(client: MLDSClient) {
    this.client = client;
  }
  whatsUp = (args:{greeting:string,frequency:number}) => {
    return this.client
      .call("whatsUp/whatsUp.sjs", { params: args })
      .then(response => {
        if (!response.ok) {
          throw "Invalid response";
        }
        return response.text();
      });
  }
}
