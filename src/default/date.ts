import { ValueSerializer, KeyValuePair } from "../interface";

export class DateSerializer implements ValueSerializer<Date> {
    canSerialize(value: unknown): value is Date {
        return value instanceof Date && !isNaN(value.getTime());
    }

    serialize(value: Date, key: string): KeyValuePair[] {
        const dd = String(value.getDate()).padStart(2, "0");
        const mm = String(value.getMonth() + 1).padStart(2, "0");
        const yyyy = value.getFullYear();
        return [{ key, value: `${dd}-${mm}-${yyyy}` }];
    }
}
