import { actorFactory } from "../actorFactory";
import { _SERVICE } from "./interface";
import { idlFactory } from "./did";
import { Principal } from "@dfinity/principal";

export type RegistryActor = _SERVICE;

export const createRegistryQueryActor = (registrarId: Principal) =>
  actorFactory.createActorWithAnonymousIdentity<RegistryActor>(
    idlFactory,
    registrarId
  );

