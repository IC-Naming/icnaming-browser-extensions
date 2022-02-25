import { Principal } from "@dfinity/principal";
import {
  createRegistryQueryActor,
  RegistryActor
} from "./canisters/registry";
import {
  createResolverQueryActorById,
} from "./canisters/resolver";
import { executeWithLogging } from "./errorLogger";

export interface NameDetails {
  name: string;
  available: boolean;
  registrant: Principal;
  controller: Principal;
  resolver: Principal;
  expireAt: Date;
}

export default class ServiceApi {

  public constructor() {
  }

  /* Registrar */

  // get name's resolver
  public getResolverOfName = (name: string,
                              registrar: Principal): Promise<Principal> => {
    return executeWithLogging(async () => {
      const res: any = await createRegistryQueryActor(registrar).get_resolver(name);
      if (res.Ok) {
        return res.Ok;
      } else {
        console.log(res.Err);
        return Principal.anonymous();
      }
    });
  };

  // get name's records
  public getRecordsOfName = (
    name: string,
    resolver: Principal
  ): Promise<Array<[string, string]>> => {
    return executeWithLogging(async () => {
      const res: any = await createResolverQueryActorById(resolver).get_record_value(name);
      if (res.Ok) {
        return res.Ok;
      } else {
        console.log(res.Err);
        return [];
      }
    });
  };
}
