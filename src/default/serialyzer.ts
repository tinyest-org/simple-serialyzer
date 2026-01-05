import { QueryParamSerializer } from "../main";
import { PrimitiveArraySerializer } from "./array";
import { PrimitiveSerializer, EmptySerializer, BooleanSerializer } from "./basic";
import { DateSerializer } from "./date";

const defaultQueryParamSerializer = new QueryParamSerializer([
    new PrimitiveSerializer(),
    new BooleanSerializer(),
    new DateSerializer(),
    new PrimitiveArraySerializer(),
    new EmptySerializer(),
] as const);

export default defaultQueryParamSerializer;
