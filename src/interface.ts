/**
 * A key-value pair for query parameters
 */
export type KeyValuePair = {
    key: string;
    value: string;
};

/**
 * Interface for custom value serializers.
 * Implement this to add support for new types.
 */
export interface ValueSerializer<T> {
    /**
     * Type guard that checks if this serializer can handle the given value.
     * @param value - The value to check
     * @returns true if this serializer handles this value type
     */
    canSerialize(value: unknown): value is T;

    /**
     * Serialize the value to key-value pairs.
     * @param value - The value to serialize (guaranteed to pass canSerialize)
     * @param key - The parameter key
     * @returns Array of key-value pairs:
     *   - Single values: [{key, value}]
     *   - Arrays: [{key, value}, {key, value}, ...]
     *   - Skip (null/undefined): []
     */
    serialize(value: T, key: string): KeyValuePair[];
}

/**
 * Error thrown when no serializer can handle a value
 */
export class MissingRenderer extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'MissingRenderer';
    }
}
