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

- **`QueryParamSerializer`** (`src/main.ts`): Main class that takes an array of serializers and uses them to convert an object into a query string. It iterates through serializers to find one that can handle each value via `shouldSerialize()`.

- **`ValueSerializer<T>` interface** (`src/interface.ts`): Contract for all serializers with three methods:
  - `shouldSerialize(value)`: Returns true if this serializer handles the value type
  - `serialize(value, key)`: Converts the value to a string (handle URI encoding here)
  - `updateKey(key)`: Optionally transform the key, or return `false` to keep original

### Built-in Serializers (`src/default/`)

- `PrimitiveSerializer`: Handles strings and numbers with URI encoding
- `BooleanSerializer`: Handles booleans, outputs "true"/"false"
- `DateSerializer`: Formats dates as `DD-MM-YYYY`
- `PrimitiveArraySerializer`: Handles arrays of primitives, outputs repeated keys (e.g., `arr=1&arr=2`)
- `EmptySerializer`: Handles null/undefined values

### Default Export

`defaultQueryParamSerializer` (`src/default/serialyzer.ts`) provides a pre-configured instance with all built-in serializers.

## Creating Custom Serializers

Implement `ValueSerializer<T>`:

```ts
class CustomSerializer implements ValueSerializer<MyType> {
    shouldSerialize(value: any): boolean { /* type check */ }
    serialize(value: MyType, key: string): string { /* convert to string */ }
    updateKey(key: string): string | false { return false; }
}
```

Then pass to `QueryParamSerializer` constructor in the order serializers should be checked.
