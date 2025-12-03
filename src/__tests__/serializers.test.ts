import { describe, expect, test } from "bun:test";
import { PrimitiveSerializer, EmptySerializer } from "../default/basic";
import { BooleanSerializer } from "../default/boolean";
import { DateSerializer } from "../default/date";
import { PrimitiveArraySerializer } from "../default/array";

describe("PrimitiveSerializer", () => {
    const serializer = new PrimitiveSerializer();

    test("shouldSerialize returns true for strings", () => {
        expect(serializer.shouldSerialize("hello")).toBe(true);
    });

    test("shouldSerialize returns true for numbers", () => {
        expect(serializer.shouldSerialize(42)).toBe(true);
        expect(serializer.shouldSerialize(0)).toBe(true);
    });

    test("shouldSerialize returns false for other types", () => {
        expect(serializer.shouldSerialize(true)).toBe(false);
        expect(serializer.shouldSerialize(null)).toBe(false);
        expect(serializer.shouldSerialize([])).toBe(false);
    });

    test("serialize encodes strings", () => {
        expect(serializer.serialize("hello", "key")).toBe("hello");
        expect(serializer.serialize("hello world", "key")).toBe("hello%20world");
        expect(serializer.serialize("a&b=c", "key")).toBe("a%26b%3Dc");
    });

    test("serialize converts numbers to strings", () => {
        expect(serializer.serialize(42, "key")).toBe("42");
        expect(serializer.serialize(0, "key")).toBe("0");
    });

    test("updateKey returns false", () => {
        expect(serializer.updateKey("key")).toBe(false);
    });
});

describe("BooleanSerializer", () => {
    const serializer = new BooleanSerializer();

    test("shouldSerialize returns true for booleans", () => {
        expect(serializer.shouldSerialize(true)).toBe(true);
        expect(serializer.shouldSerialize(false)).toBe(true);
    });

    test("shouldSerialize returns false for other types", () => {
        expect(serializer.shouldSerialize("true")).toBe(false);
        expect(serializer.shouldSerialize(1)).toBe(false);
        expect(serializer.shouldSerialize(null)).toBe(false);
    });

    test("serialize returns 'true' or 'false'", () => {
        expect(serializer.serialize(true, "key")).toBe("true");
        expect(serializer.serialize(false, "key")).toBe("false");
    });

    test("updateKey returns false", () => {
        expect(serializer.updateKey("key")).toBe(false);
    });
});

describe("EmptySerializer", () => {
    const serializer = new EmptySerializer();

    test("shouldSerialize returns true for null and undefined", () => {
        expect(serializer.shouldSerialize(null)).toBe(true);
        expect(serializer.shouldSerialize(undefined)).toBe(true);
    });

    test("shouldSerialize returns false for other falsy values", () => {
        expect(serializer.shouldSerialize(0)).toBe(false);
        expect(serializer.shouldSerialize("")).toBe(false);
        expect(serializer.shouldSerialize(false)).toBe(false);
    });

    test("serialize returns empty string", () => {
        expect(serializer.serialize(null, "key")).toBe("");
        expect(serializer.serialize(undefined, "key")).toBe("");
    });

    test("updateKey returns false", () => {
        expect(serializer.updateKey("key")).toBe(false);
    });
});

describe("DateSerializer", () => {
    const serializer = new DateSerializer();

    test("shouldSerialize returns true for Date objects", () => {
        expect(serializer.shouldSerialize(new Date())).toBe(true);
    });

    test("shouldSerialize returns false for other types", () => {
        expect(serializer.shouldSerialize("2024-01-15")).toBe(false);
        expect(serializer.shouldSerialize(1705276800000)).toBe(false);
    });

    test("serialize formats date as DD-MM-YYYY", () => {
        const date = new Date(2025, 0, 15); // January 15, 2025
        expect(serializer.serialize(date, "key")).toBe("15-01-2025");
    });

    test("serialize pads single digit day and month", () => {
        const date = new Date(2025, 5, 5); // June 5, 2025
        expect(serializer.serialize(date, "key")).toBe("05-06-2025");
    });

    test("updateKey returns false", () => {
        expect(serializer.updateKey("key")).toBe(false);
    });
});

describe("PrimitiveArraySerializer", () => {
    const primitiveSerializer = new PrimitiveSerializer();
    const serializer = new PrimitiveArraySerializer(primitiveSerializer);

    test("shouldSerialize returns true for string arrays", () => {
        expect(serializer.shouldSerialize(["a", "b"])).toBe(true);
    });

    test("shouldSerialize returns true for number arrays", () => {
        expect(serializer.shouldSerialize([1, 2, 3])).toBe(true);
    });

    test("shouldSerialize returns true for empty arrays", () => {
        expect(serializer.shouldSerialize([])).toBe(true);
    });

    test("shouldSerialize returns false for non-arrays", () => {
        expect(serializer.shouldSerialize("not an array")).toBe(false);
        expect(serializer.shouldSerialize(123)).toBe(false);
    });

    test("serialize formats as repeated keys", () => {
        expect(serializer.serialize([1, 2, 3], "arr")).toBe("arr=1&arr=2&arr=3");
        expect(serializer.serialize(["a", "b"], "items")).toBe("items=a&items=b");
    });

    test("serialize handles empty arrays", () => {
        expect(serializer.serialize([], "arr")).toBe("");
    });

    test("updateKey returns empty string", () => {
        expect(serializer.updateKey("key")).toBe("");
    });
});
