import { describe, expect, test } from "bun:test";
import { PrimitiveSerializer, EmptySerializer } from "../default/basic";
import { BooleanSerializer } from "../default/boolean";
import { DateSerializer } from "../default/date";
import { PrimitiveArraySerializer } from "../default/array";

describe("PrimitiveSerializer", () => {
    const serializer = new PrimitiveSerializer();

    describe("canSerialize", () => {
        test("returns true for strings", () => {
            expect(serializer.canSerialize("hello")).toBe(true);
            expect(serializer.canSerialize("")).toBe(true);
        });

        test("returns true for numbers", () => {
            expect(serializer.canSerialize(42)).toBe(true);
            expect(serializer.canSerialize(0)).toBe(true);
            expect(serializer.canSerialize(-1)).toBe(true);
            expect(serializer.canSerialize(3.14)).toBe(true);
        });

        test("returns false for other types", () => {
            expect(serializer.canSerialize(true)).toBe(false);
            expect(serializer.canSerialize(null)).toBe(false);
            expect(serializer.canSerialize(undefined)).toBe(false);
            expect(serializer.canSerialize([])).toBe(false);
            expect(serializer.canSerialize({})).toBe(false);
        });
    });

    describe("serialize", () => {
        test("returns key-value pair for strings", () => {
            expect(serializer.serialize("hello", "name")).toEqual([
                { key: "name", value: "hello" },
            ]);
        });

        test("encodes special characters", () => {
            expect(serializer.serialize("hello world", "q")).toEqual([
                { key: "q", value: "hello%20world" },
            ]);
            expect(serializer.serialize("a&b=c", "x")).toEqual([
                { key: "x", value: "a%26b%3Dc" },
            ]);
        });

        test("returns key-value pair for numbers", () => {
            expect(serializer.serialize(42, "count")).toEqual([
                { key: "count", value: "42" },
            ]);
            expect(serializer.serialize(0, "zero")).toEqual([
                { key: "zero", value: "0" },
            ]);
        });
    });
});

describe("BooleanSerializer", () => {
    const serializer = new BooleanSerializer();

    describe("canSerialize", () => {
        test("returns true for booleans", () => {
            expect(serializer.canSerialize(true)).toBe(true);
            expect(serializer.canSerialize(false)).toBe(true);
        });

        test("returns false for other types", () => {
            expect(serializer.canSerialize("true")).toBe(false);
            expect(serializer.canSerialize(1)).toBe(false);
            expect(serializer.canSerialize(0)).toBe(false);
            expect(serializer.canSerialize(null)).toBe(false);
        });
    });

    describe("serialize", () => {
        test("returns 'true' for true", () => {
            expect(serializer.serialize(true, "active")).toEqual([
                { key: "active", value: "true" },
            ]);
        });

        test("returns 'false' for false", () => {
            expect(serializer.serialize(false, "active")).toEqual([
                { key: "active", value: "false" },
            ]);
        });
    });
});

describe("EmptySerializer", () => {
    const serializer = new EmptySerializer();

    describe("canSerialize", () => {
        test("returns true for null", () => {
            expect(serializer.canSerialize(null)).toBe(true);
        });

        test("returns true for undefined", () => {
            expect(serializer.canSerialize(undefined)).toBe(true);
        });

        test("returns false for other falsy values", () => {
            expect(serializer.canSerialize(0)).toBe(false);
            expect(serializer.canSerialize("")).toBe(false);
            expect(serializer.canSerialize(false)).toBe(false);
        });
    });

    describe("serialize", () => {
        test("returns empty array for null", () => {
            expect(serializer.serialize(null, "key")).toEqual([]);
        });

        test("returns empty array for undefined", () => {
            expect(serializer.serialize(undefined, "key")).toEqual([]);
        });
    });
});

describe("DateSerializer", () => {
    const serializer = new DateSerializer();

    describe("canSerialize", () => {
        test("returns true for valid Date objects", () => {
            expect(serializer.canSerialize(new Date())).toBe(true);
            expect(serializer.canSerialize(new Date(2025, 0, 15))).toBe(true);
        });

        test("returns false for invalid dates", () => {
            expect(serializer.canSerialize(new Date("invalid"))).toBe(false);
            expect(serializer.canSerialize(new Date(NaN))).toBe(false);
        });

        test("returns false for other types", () => {
            expect(serializer.canSerialize("2024-01-15")).toBe(false);
            expect(serializer.canSerialize(1705276800000)).toBe(false);
            expect(serializer.canSerialize(null)).toBe(false);
        });
    });

    describe("serialize", () => {
        test("formats date as DD-MM-YYYY", () => {
            const date = new Date(2025, 0, 15); // January 15, 2025
            expect(serializer.serialize(date, "date")).toEqual([
                { key: "date", value: "15-01-2025" },
            ]);
        });

        test("pads single digit day and month", () => {
            const date = new Date(2025, 5, 5); // June 5, 2025
            expect(serializer.serialize(date, "d")).toEqual([
                { key: "d", value: "05-06-2025" },
            ]);
        });
    });
});

describe("PrimitiveArraySerializer", () => {
    const serializer = new PrimitiveArraySerializer();

    describe("canSerialize", () => {
        test("returns true for string arrays", () => {
            expect(serializer.canSerialize(["a", "b"])).toBe(true);
        });

        test("returns true for number arrays", () => {
            expect(serializer.canSerialize([1, 2, 3])).toBe(true);
        });

        test("returns true for empty arrays", () => {
            expect(serializer.canSerialize([])).toBe(true);
        });

        test("returns true for mixed string/number arrays", () => {
            expect(serializer.canSerialize([1, "two", 3])).toBe(true);
        });

        test("returns false for arrays with other types", () => {
            expect(serializer.canSerialize([true, false])).toBe(false);
            expect(serializer.canSerialize([null])).toBe(false);
            expect(serializer.canSerialize([{}])).toBe(false);
            expect(serializer.canSerialize([1, null])).toBe(false);
        });

        test("returns false for non-arrays", () => {
            expect(serializer.canSerialize("not an array")).toBe(false);
            expect(serializer.canSerialize(123)).toBe(false);
            expect(serializer.canSerialize(null)).toBe(false);
        });
    });

    describe("serialize", () => {
        test("returns multiple pairs for arrays", () => {
            expect(serializer.serialize([1, 2, 3], "ids")).toEqual([
                { key: "ids", value: "1" },
                { key: "ids", value: "2" },
                { key: "ids", value: "3" },
            ]);
        });

        test("encodes string values", () => {
            expect(serializer.serialize(["a b", "c&d"], "tags")).toEqual([
                { key: "tags", value: "a%20b" },
                { key: "tags", value: "c%26d" },
            ]);
        });

        test("returns empty array for empty input", () => {
            expect(serializer.serialize([], "arr")).toEqual([]);
        });
    });
});
