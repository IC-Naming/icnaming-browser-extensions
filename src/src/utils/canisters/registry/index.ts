import { actorFactory } from "../actorFactory";
import { _SERVICE } from "./interface";
import { idlFactory } from "./did";
import { getRegistryId } from "./canisterId";

export type RegistryActor = _SERVICE;

export const createRegistryQueryActor = () =>
  actorFactory.createActorWithAnonymousIdentity<RegistryActor>(
    idlFactory,
    getRegistryId()
  );

export const createRegistryUpdateActor = () =>
  actorFactory.createActor<RegistryActor>(
    idlFactory,
    getRegistryId()
  );
