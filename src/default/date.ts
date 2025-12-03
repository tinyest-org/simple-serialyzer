import { ValueSerializer } from "../interface";
import { padZeros } from "../utils";

export class DateSerializer implements ValueSerializer<Date> {
    shouldSerialize(value: any): boolean {
        return value instanceof Date;
    }
    serialize(value: Date, _key: string): string {
        return `${padZeros(value.getDate(), 2)}-${padZeros(value.getMonth() + 1, 2)}-${value.getFullYear()}`;
    }
    updateKey(_key: string): string | false {
        return false;
    }
}