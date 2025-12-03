import { QueryParamSerializer } from "../main";
import { PrimitiveArraySerializer } from "./array";
import { PrimitiveSerializer, EmptySerializer } from "./basic";
import { BooleanSerializer } from "./boolean";
import { DateSerializer } from "./date";

const defaultQueryParamSerializer = new QueryParamSerializer([
    new PrimitiveSerializer(),
    new BooleanSerializer(),
    new DateSerializer(),
    new PrimitiveArraySerializer(),
    new EmptySerializer(),
]);

export default defaultQueryParamSerializer;
