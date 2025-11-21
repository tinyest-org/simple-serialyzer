
export interface ValueSerializer<T> {
    /**
     *
     * @param value to check this Serialiezer should handle it
     */
    shouldSerialize(value: any): boolean;
    /**
     * If the returned value should be URIComponent encoded then, it should be done in the serialize function
     * @param value
     * @param key
     */
    serialize(value: T, key: string): string;
    updateKey(key: string): string | false;
}

export type ValueSerializerType<T> = T extends ValueSerializer<infer U> ? U : T;

export type Params<T> = {
    [key: string]: ValueSerializerType<T>;
};

export type ArrayType<T> = T extends Array<infer U> ? U : T;

export class MissingRenderer extends Error { }

