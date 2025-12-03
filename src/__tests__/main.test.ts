import { describe, expect, test } from "bun:test";
import { QueryParamSerializer, MissingRenderer } from "../index";
import defaultQueryParamSerializer from "../default/serialyzer";

describe("QueryParamSerializer", () => {
    describe("with default serializer", () => {
        test("serializes primitive values", () => {
            const result = defaultQueryParamSerializer.serialize({
                name: "hello",
                count: 42,
            });
            expect(result).toBe("?name=hello&count=42");
        });

        test("serializes falsy values correctly", () => {
            const result = defaultQueryParamSerializer.serialize({
                zero: 0,
                empty: "",
                flag: false,
            });
            expect(result).toBe("?zero=0&empty=&flag=false");
        });

        test("serializes boolean values", () => {
            const result = defaultQueryParamSerializer.serialize({
                active: true,
                disabled: false,
            });
            expect(result).toBe("?active=true&disabled=false");
        });

        test("serializes date values", () => {
            const date = new Date(2025, 0, 15); // January 15, 2025
            const result = defaultQueryParamSerializer.serialize({
                date: date,
            });
            expect(result).toBe("?date=15-01-2025");
        });

        test("serializes arrays with repeated keys", () => {
            const result = defaultQueryParamSerializer.serialize({
                ids: [1, 2, 3],
            });
            expect(result).toBe("?ids=1&ids=2&ids=3");
        });

        test("skips null and undefined values", () => {
            const result = defaultQueryParamSerializer.serialize({
                name: "test",
                empty: null,
                missing: undefined,
            });
            expect(result).toBe("?name=test");
        });

        test("returns empty string when all values are null/undefined", () => {
            const result = defaultQueryParamSerializer.serialize({
                a: null,
                b: undefined,
            });
            expect(result).toBe("");
        });

        test("encodes special characters", () => {
            const result = defaultQueryParamSerializer.serialize({
                query: "hello world",
                special: "a&b=c",
            });
            expect(result).toBe("?query=hello%20world&special=a%26b%3Dc");
        });

        test("handles mixed types", () => {
            const result = defaultQueryParamSerializer.serialize({
                name: "test",
                count: 5,
                active: true,
                tags: ["a", "b"],
            });
            expect(result).toBe("?name=test&count=5&active=true&tags=a&tags=b");
        });
    });

    describe("first parameter", () => {
        test("prepends ? when first is true (default)", () => {
            const result = defaultQueryParamSerializer.serialize({ a: 1 });
            expect(result).toBe("?a=1");
        });

        test("prepends & when first is false", () => {
            const result = defaultQueryParamSerializer.serialize({ a: 1 }, false);
            expect(result).toBe("&a=1");
        });
    });

    describe("error handling", () => {
        test("throws MissingRenderer for unsupported types", () => {
            const serializer = new QueryParamSerializer([] as any);
            expect(() => serializer.serialize({ value: "test" })).toThrow(MissingRenderer);
        });
    });
});
