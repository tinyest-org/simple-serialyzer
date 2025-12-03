import { ValueSerializer } from "../interface";

export class BooleanSerializer implements ValueSerializer<boolean> {
    shouldSerialize(value: any): boolean {
        return typeof value === "boolean";
    }
    serialize(value: boolean, _key: string): string {
        return value ? "true" : "false";
    }
    updateKey(_key: string): string | false {
        return false;
    }
}
