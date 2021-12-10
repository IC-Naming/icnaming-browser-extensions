import {actorFactory} from "../actorFactory";
import {_SERVICE} from "./interface";
import {idlFactory} from "./did";
import {RESOLVER_ID} from "./canisterId";
import {Principal} from "@dfinity/principal";

export type ResolverActor = _SERVICE;

export const createResolverQueryActor = () =>
    actorFactory.createActorWithAnonymousIdentity<ResolverActor>(
        idlFactory,
        RESOLVER_ID
    );

export const createResolverQueryActorById = (resolver: Principal) =>
    actorFactory.createActorWithAnonymousIdentity<ResolverActor>(
        idlFactory,
        resolver
    );

export const createResolverUpdateActor = () =>
    actorFactory.createActor<ResolverActor>(
        idlFactory,
        RESOLVER_ID
    );
