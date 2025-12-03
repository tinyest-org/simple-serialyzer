import { QueryParamSerializer } from "../main";
import { PrimitiveArraySerializer } from "./array";
import { PrimitiveSerializer, EmptySerializer } from "./basic";
import { BooleanSerializer } from "./boolean";
import { DateSerializer } from "./date";

const primitiveSerializer = new PrimitiveSerializer();

const defaultQueryParamSerializer = new QueryParamSerializer([
  primitiveSerializer,
  new BooleanSerializer(),
  new DateSerializer(),
  new PrimitiveArraySerializer(primitiveSerializer),
  new EmptySerializer(),
]);

export default defaultQueryParamSerializer;
