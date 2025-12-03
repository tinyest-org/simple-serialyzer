import { ValueSerializer, KeyValuePair } from "../interface";

export class BooleanSerializer implements ValueSerializer<boolean> {
    canSerialize(value: unknown): value is boolean {
        return typeof value === "boolean";
    }

    serialize(value: boolean, key: string): KeyValuePair[] {
        return [{ key, value: value ? "true" : "false" }];
    }
}
