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

        test("handles empty arrays", () => {
            const result = defaultQueryParamSerializer.serialize({
                name: "test",
                tags: [],
            });
            expect(result).toBe("?name=test");
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

    describe("input validation", () => {
        test("throws TypeError for null params", () => {
            expect(() => defaultQueryParamSerializer.serialize(null as any)).toThrow(TypeError);
        });

        test("throws TypeError for undefined params", () => {
            expect(() => defaultQueryParamSerializer.serialize(undefined as any)).toThrow(TypeError);
        });

        test("throws TypeError for array params", () => {
            expect(() => defaultQueryParamSerializer.serialize([] as any)).toThrow(TypeError);
        });

        test("throws TypeError for primitive params", () => {
            expect(() => defaultQueryParamSerializer.serialize("string" as any)).toThrow(TypeError);
            expect(() => defaultQueryParamSerializer.serialize(123 as any)).toThrow(TypeError);
        });
    });

    describe("error handling", () => {
        test("throws MissingRenderer for unsupported types", () => {
            const serializer = new QueryParamSerializer([]);
            expect(() => serializer.serialize({ value: "test" })).toThrow(MissingRenderer);
        });

        test("throws MissingRenderer for symbols", () => {
            expect(() => defaultQueryParamSerializer.serialize({ sym: Symbol("test") })).toThrow(MissingRenderer);
        });

        test("throws MissingRenderer for functions", () => {
            expect(() => defaultQueryParamSerializer.serialize({ fn: () => {} })).toThrow(MissingRenderer);
        });

        test("throws MissingRenderer for invalid dates", () => {
            expect(() => defaultQueryParamSerializer.serialize({ date: new Date("invalid") })).toThrow(MissingRenderer);
        });

        test("throws MissingRenderer for arrays with unsupported types", () => {
            expect(() => defaultQueryParamSerializer.serialize({ arr: [true, false] })).toThrow(MissingRenderer);
        });
    });
});
