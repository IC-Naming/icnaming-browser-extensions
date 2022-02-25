import { actorFactory } from "../actorFactory";
import { _SERVICE } from "./interface";
import { idlFactory } from "./did";
import { Principal } from "@dfinity/principal";

export type ResolverActor = _SERVICE;

export const createResolverQueryActorById = (resolver: Principal) =>
  actorFactory.createActorWithAnonymousIdentity<ResolverActor>(
    idlFactory,
    resolver
  );
