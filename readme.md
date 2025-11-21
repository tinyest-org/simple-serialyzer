# Simple Serialyer


This lib aims to make url serialyzation simple, by providing a list of serialyzer to a common interface.

## Example

```ts
const defaultQueryParamSerializer = new QueryParamSerializer([
  primitiveSerializer,
  new DateSerializer(),
  new PrimitiveArraySerializer(primitiveSerializer),
  new EmptySerializer(),
]);

// here wa can serialyze this url easely

const url = defaultQueryParamSerializer.serialyze({
    test: "Hello",
    arr: [1, 2, 3],
    arr2: ["1", "3"],
});
// -> url = ?text=hello&arr=1&arr=2&arr=3&arr2=1&arr2=3
```

You can easely add a serilyzer for each type you need

```ts

export class TestSerializer implements ValueSerializer<Test> {
    shouldSerialize(value: any): boolean {
        return value instanceof Test;
    }
    serialize(value: Test, _key: string): string {
        return "I'm test my value is" + value.content;
    }
    updateKey(_key: string): string | false {
        return false;
    }
}

const defaultQueryParamSerializer = new QueryParamSerializer([
  primitiveSerializer,
  new DateSerializer(),
  new PrimitiveArraySerializer(primitiveSerializer),
  new EmptySerializer(),
  new TestSerializer(),
//   here add test
]);

// here wa can serialyze this url easely

class Test {
  public content: string | undefined;

  public Test(content: string) {
    this.content = content;
  }
}

const url = defaultQueryParamSerializer.serialyze({
    test: "Hello",
    arr: [1, 2, 3],
    arr2: ["1", "3"],
    value: new Test("ValueFromClass"),
    // here add test
});

// here add final url
// -> url = ?text=hello&arr=1&arr=2&arr=3&arr2=1&arr2=3&value=ValueFromClass
```