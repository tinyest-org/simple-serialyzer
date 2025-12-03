# Simple Serializer

A TypeScript library for URL query parameter serialization with a pluggable serializer architecture.

## Installation

```bash
bun add @petite-org/simple-serialyzer
```

## Quick Start

Use the pre-configured default serializer:

```ts
import { defaultQueryParamSerializer } from '@petite-org/simple-serialyzer';

const url = defaultQueryParamSerializer.serialize({
    name: "Hello",
    count: 42,
    active: true,
    tags: ["a", "b"],
    date: new Date(),
});
// -> ?name=Hello&count=42&active=true&tags=a&tags=b&date=03-12-2025
```

## Custom Configuration

Create your own serializer with specific handlers:

```ts
import {
    QueryParamSerializer,
    PrimitiveSerializer,
    BooleanSerializer,
    DateSerializer,
    PrimitiveArraySerializer,
} from '@petite-org/simple-serialyzer';

const querySerializer = new QueryParamSerializer([
    new PrimitiveSerializer(),
    new BooleanSerializer(),
    new DateSerializer(),
    new PrimitiveArraySerializer(),
]);

const url = querySerializer.serialize({
    test: "Hello",
    arr: [1, 2, 3],
});
// -> ?test=Hello&arr=1&arr=2&arr=3
```

## Creating Custom Serializers

Implement the `ValueSerializer` interface to handle custom types:

```ts
import { ValueSerializer, KeyValuePair } from '@petite-org/simple-serialyzer';

class User {
    constructor(public id: number, public name: string) {}
}

class UserSerializer implements ValueSerializer<User> {
    canSerialize(value: unknown): value is User {
        return value instanceof User;
    }

    serialize(value: User, key: string): KeyValuePair[] {
        return [{ key, value: encodeURIComponent(`${value.id}:${value.name}`) }];
    }
}

// Add to your serializer chain
const querySerializer = new QueryParamSerializer([
    new UserSerializer(),
    new PrimitiveSerializer(),
    // ... other serializers
]);
```

## Built-in Serializers

| Serializer | Handles | Output |
|------------|---------|--------|
| `PrimitiveSerializer` | strings, numbers | URI-encoded value |
| `BooleanSerializer` | booleans | `"true"` or `"false"` |
| `DateSerializer` | valid Date objects | `DD-MM-YYYY` format |
| `PrimitiveArraySerializer` | (string \| number)[] | Multiple pairs: `key=1&key=2` |
| `EmptySerializer` | null, undefined | Skipped (empty array) |

## API

### `QueryParamSerializer.serialize(params, first?)`

- `params`: Object with values to serialize
- `first`: If `true` (default), prepends `?`; if `false`, prepends `&`

Returns the serialized query string.

**Throws:**
- `TypeError` if params is not an object
- `MissingRenderer` if no serializer can handle a value (including invalid dates)

### `ValueSerializer<T>` Interface

```ts
interface ValueSerializer<T> {
    canSerialize(value: unknown): value is T;
    serialize(value: T, key: string): KeyValuePair[];
}

type KeyValuePair = { key: string; value: string };
```

## License

ISC
