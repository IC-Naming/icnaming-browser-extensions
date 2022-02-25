import { actorFactory } from "../actorFactory";
import {
  _SERVICE,
  Result,
  Result_1,
  Result_2,
  Result_3,
  GetPageInput,
  RegistrationDto,
} from "./interface";
import { idlFactory } from "./did";
export type RegistrarActor = _SERVICE;
export type AvailableResult = Result;
export type NameExpireResult = Result_1;
export type NamesOfAddressResult = Result_2;
export type RegisterResult = Result_3;
export type PagingArgs = GetPageInput;
export type SearchResult = AvailableResult | NamesOfAddressResult;
export type Registration = RegistrationDto;