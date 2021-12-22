import { actorFactory } from "../actorFactory";
import { _SERVICE } from "./interface";
import { idlFactory } from "./did";
import { getResolverId } from "./canisterId";
import { Principal } from "@dfinity/principal";

export type ResolverActor = _SERVICE;

export const createResolverQueryActor = () =>
  actorFactory.createActorWithAnonymousIdentity<ResolverActor>(
    idlFactory,
    getResolverId()
  );

export const createResolverQueryActorById = (resolver: Principal) =>
  actorFactory.createActorWithAnonymousIdentity<ResolverActor>(
    idlFactory,
    resolver
  );

export const createResolverUpdateActor = () =>
  actorFactory.createActor<ResolverActor>(
    idlFactory,
    getResolverId()
  );
