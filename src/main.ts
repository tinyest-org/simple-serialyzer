import { ValueSerializer, KeyValuePair, MissingRenderer, ExtractSerializedTypes } from "./interface";

export class QueryParamSerializer<T extends readonly ValueSerializer<unknown>[]> {
    private readonly serializers: T;

    constructor(serializers: T) {
        this.serializers = serializers;
    }

    /**
     * Serialize an object to a query string.
     * @param params - Object with values to serialize
     * @param first - If true (default), prepends "?"; if false, prepends "&"
     * @returns The formatted query string
     * @throws {TypeError} If params is not an object
     * @throws {MissingRenderer} If no serializer can handle a value
     */
    serialize(params: Record<string, ExtractSerializedTypes<T>>, first: boolean = true): string {
        if (params == null || typeof params !== "object" || Array.isArray(params)) {
            throw new TypeError("params must be a non-null object");
        }

        const pairs: KeyValuePair[] = Object.entries(params).flatMap(([key, value]) => {
            // Skip null/undefined by default
            if (value === undefined || value === null) {
                return [];
            }

            const serializer = this.serializers.find(s => s.canSerialize(value));
            if (!serializer) {
                throw new MissingRenderer(`No serializer for value of type: ${typeof value}`);
            }

            return serializer.serialize(value, key);
        });

        if (pairs.length === 0) {
            return "";
        }

        const queryString = pairs.map(p => `${p.key}=${p.value}`).join("&");
        return first ? `?${queryString}` : `&${queryString}`;
    }
}
