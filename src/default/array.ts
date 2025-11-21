import { ValueSerializer } from "../interface";


export class PrimitiveArraySerializer implements ValueSerializer<number[] | string[]> {
    private readonly primitiveSerializer: ValueSerializer<string | Number>;
  
    constructor(s: ValueSerializer<string | number>) {
      this.primitiveSerializer = s;
    }
  
    shouldSerialize(value: any) {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          return typeof value[0] === "number" || typeof value[0] === "string";
        } else {
          return true;
        }
      }
      return false;
    }
    serialize(values: number[] | string[], key: string): string {
      const { serialize } = this.primitiveSerializer;
      return values
        .map(v => `${key}=${serialize(v, key)}`)
        .join("&");
    }
    updateKey(_key: string): string | false {
      // we erase the key
      return "";
    }
  }