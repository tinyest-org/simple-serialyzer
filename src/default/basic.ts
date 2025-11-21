import { ValueSerializer } from "../interface";


export class PrimitiveSerializer implements ValueSerializer<number | string> {
    shouldSerialize(value: any) {
        return typeof value === "number" || typeof value === "string";
    }
    serialize(value: number | string, _key: string): string {
        return encodeURIComponent(`${value}`);
    }
    updateKey(_key: string): string | false {
        return false;
    }
}


export class EmptySerializer implements ValueSerializer<undefined | null> {
    shouldSerialize(value: any): boolean {
        return value === undefined || value === null;
    }
    serialize(_value: null | undefined, _key: string): string {
        return "";
    }
    updateKey(_key: string): string | false {
        return false;
    }
}