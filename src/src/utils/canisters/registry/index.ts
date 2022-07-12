import {actorFactory} from "../actorFactory";
import {_SERVICE, idlFactory} from "@icnaming/registry_client";
import {Principal} from "@dfinity/principal";

export type RegistryActor = _SERVICE;

export const createRegistryQueryActor = (registrarId: Principal) =>
    actorFactory.createActorWithAnonymousIdentity<RegistryActor>(
        idlFactory,
        registrarId
    );

