# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
bun run build    # Compile TypeScript to dist/
bun test         # Run tests with bun:test
```

## Architecture

This is a TypeScript library for serializing JavaScript objects into URL query parameter strings. The library uses a pluggable serializer pattern.

### Core Components

- **`QueryParamSerializer`** (`src/main.ts`): Main class that takes an array of serializers and uses them to convert an object into a query string. It iterates through serializers to find one that can handle each value via `canSerialize()`.

- **`ValueSerializer<T>` interface** (`src/interface.ts`): Contract for all serializers with two methods:
  - `canSerialize(value: unknown): value is T`: Type guard that returns true if this serializer handles the value
  - `serialize(value: T, key: string): KeyValuePair[]`: Returns array of key-value pairs

- **`KeyValuePair`** (`src/interface.ts`): Simple type `{ key: string; value: string }` returned by serializers.

### Built-in Serializers (`src/default/`)

- `PrimitiveSerializer`: Handles strings and numbers with URI encoding
- `BooleanSerializer`: Handles booleans, outputs "true"/"false"
- `DateSerializer`: Formats valid dates as `DD-MM-YYYY` (rejects invalid dates)
- `PrimitiveArraySerializer`: Handles arrays of strings/numbers, returns multiple pairs
- `EmptySerializer`: Handles null/undefined, returns empty array (skips)

### Default Export

`defaultQueryParamSerializer` (`src/default/serialyzer.ts`) provides a pre-configured instance with all built-in serializers.

## Creating Custom Serializers

Implement `ValueSerializer<T>`:

```ts
import { ValueSerializer, KeyValuePair } from '@petite-org/simple-serialyzer';

class CustomSerializer implements ValueSerializer<MyType> {
    canSerialize(value: unknown): value is MyType {
        return value instanceof MyType;
    }
    serialize(value: MyType, key: string): KeyValuePair[] {
        return [{ key, value: encodeURIComponent(value.toString()) }];
    }
}
```

Then pass to `QueryParamSerializer` constructor in the order serializers should be checked.
