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
    arr: [1, 2, 3],
    date: new Date(),
});
// -> ?name=Hello&arr=1&arr=2&arr=3&date=03-12-2025
```

## Custom Configuration

Create your own serializer with specific handlers:

```ts
import {
    QueryParamSerializer,
    PrimitiveSerializer,
    DateSerializer,
    PrimitiveArraySerializer,
    EmptySerializer,
} from '@petite-org/simple-serialyzer';

const primitiveSerializer = new PrimitiveSerializer();

const querySerializer = new QueryParamSerializer([
    primitiveSerializer,
    new DateSerializer(),
    new PrimitiveArraySerializer(primitiveSerializer),
    new EmptySerializer(),
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
import { ValueSerializer } from '@petite-org/simple-serialyzer';

class User {
    constructor(public id: number, public name: string) {}
}

class UserSerializer implements ValueSerializer<User> {
    shouldSerialize(value: any): boolean {
        return value instanceof User;
    }

    serialize(value: User, _key: string): string {
        return encodeURIComponent(`${value.id}:${value.name}`);
    }

    updateKey(_key: string): string | false {
        return false; // keep original key
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
| `DateSerializer` | Date objects | `DD-MM-YYYY` format |
| `PrimitiveArraySerializer` | string[], number[] | Repeated keys: `key=1&key=2` |
| `EmptySerializer` | null, undefined | Empty string |

## API

### `QueryParamSerializer.serialize(params, first?)`

- `params`: Object with values to serialize
- `first`: If `true` (default), prepends `?`; if `false`, prepends `&`

Returns the serialized query string.

## License

ISC
