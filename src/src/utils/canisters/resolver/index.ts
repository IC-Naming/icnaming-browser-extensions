import {actorFactory} from "../actorFactory";
import {idlFactory, _SERVICE} from "@icnaming/resolver_client";
import {Principal} from "@dfinity/principal";

export type ResolverActor = _SERVICE;

export const createResolverQueryActorById = (resolver: Principal) =>
    actorFactory.createActorWithAnonymousIdentity<ResolverActor>(
        idlFactory,
        resolver
    );
