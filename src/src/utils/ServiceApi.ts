import { Principal } from "@dfinity/principal";
import {
  createRegistrarQueryActor,
  PagingArgs,
  RegistrarActor,
  Registration
} from "./canisters/registrar";
import {
  createRegistryQueryActor,
  RegistryActor
} from "./canisters/registry";
import {
  createResolverQueryActor,
  createResolverQueryActorById,
  ResolverActor
} from "./canisters/resolver";
import { executeWithLogging } from "./errorLogger";
import { RegistrationDetails } from "./canisters/registrar/interface";
import { RegistryDto } from "./canisters/registry/interface";

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

  // names or addresses search
  public available = (word: string): Promise<boolean> => {
    // if word is string and not empty
    if (word.length > 0) {
      return executeWithLogging(async () => {
        const res: any = await createRegistrarQueryActor().available(`${word}`);
        // if res is ErrorInfo

        if (res.Ok) {
          return res.Ok;
        } else {
          console.log(res.Err);
          return false;
        }
      });
    } else return Promise.reject(new Error("Invalid search word"));
  };

  // get name expires
  public expireAtOf = (name: string): Promise<number> => {
    return executeWithLogging(async () => {
      const res: any = await createRegistrarQueryActor().get_name_expires(name);
      if (res.Ok) {
        return Number(res.Ok);
      } else {
        console.log(res.Err);
        return 0;
      }
    });
  };

  public getNamesOfRegistrant = (
    address: Principal
  ): Promise<Array<Registration>> => {
    const pagingArgs: PagingArgs = {
      offset: BigInt(0),
      limit: BigInt(100)
    };
    return executeWithLogging(async () => {
      const res: any = await createRegistrarQueryActor().get_names(
        address,
        pagingArgs
      );
      if (res.Ok) {
        return res.Ok.items;
      } else {
        console.log(res.Err);
        return [];
      }
    });
  };

  public getNamesOfController = (
    address: Principal
  ): Promise<Array<Registration>> => {
    const pagingArgs: PagingArgs = {
      offset: BigInt(0),
      limit: BigInt(100)
    };
    return executeWithLogging(async () => {
      const res: any = await createRegistryQueryActor().get_controlled_names(
        address,
        pagingArgs
      );
      if (res.Ok) {
        return res.Ok.items;
      } else {
        console.log(res.Err);
        return [];
      }
    });
  };

  // get name's registrant
  public getRegistrantOfName = (name: string): Promise<Principal> => {
    return executeWithLogging(async () => {
      const res: any = await createRegistrarQueryActor().get_owner(name);
      if (res.Ok) {
        return res.Ok;
      } else {
        console.log(res.Err);
        return Principal.anonymous();
      }
    });
  };

  // get name's controller
  public getControllerOfName = (name: string): Promise<Principal> => {
    return executeWithLogging(async () => {
      const res: any = await createRegistryQueryActor().get_owner(name);
      if (res.Ok) {
        return res.Ok;
      } else {
        console.log(res.Err);
        return Principal.anonymous();
      }
    });
  };

  // get name's resolver
  public getResolverOfName = (name: string): Promise<Principal> => {
    return executeWithLogging(async () => {
      const res: any = await createRegistryQueryActor().get_resolver(name);
      if (res.Ok) {
        return res.Ok;
      } else {
        console.log(res.Err);
        return Principal.anonymous();
      }
    });
  };

  // get name's RegistrationDetails
  public getRegistrationDetailsOfName = (
    name: string
  ): Promise<RegistrationDetails> => {
    return executeWithLogging(async () => {
      const res: any = await createRegistrarQueryActor().get_details(name);
      if (res.Ok) {
        return res.Ok;
      } else {
        console.log(res.Err);
        return {};
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
  // get details of name  registry
  public getRegistryDetailsOfName = (name: string): Promise<RegistryDto> => {
    return executeWithLogging(async () => {
      const res: any = await createRegistryQueryActor().get_details(name);
      if (res.Ok) {
        return res.Ok;
      } else {
        console.log(res.Err);
        return {};
      }
    });
  };
}
