import { ValueSerializer, KeyValuePair } from "../interface";

export class PrimitiveArraySerializer implements ValueSerializer<(string | number)[]> {
    canSerialize(value: unknown): value is (string | number)[] {
        return (
            Array.isArray(value) &&
            value.every(v => typeof v === "string" || typeof v === "number")
        );
    }

    serialize(values: (string | number)[], key: string): KeyValuePair[] {
        return values.map(v => ({
            key,
            value: encodeURIComponent(String(v)),
        }));
    }
}
