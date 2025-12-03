import { ValueSerializer, KeyValuePair } from "../interface";

export class PrimitiveSerializer implements ValueSerializer<string | number> {
    canSerialize(value: unknown): value is string | number {
        return typeof value === "string" || typeof value === "number";
    }

    serialize(value: string | number, key: string): KeyValuePair[] {
        return [{ key, value: encodeURIComponent(String(value)) }];
    }
}

export class EmptySerializer implements ValueSerializer<null | undefined> {
    canSerialize(value: unknown): value is null | undefined {
        return value === null || value === undefined;
    }

    serialize(_value: null | undefined, _key: string): KeyValuePair[] {
        return [];
    }
}
