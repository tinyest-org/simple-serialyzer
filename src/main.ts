import { ValueSerializer, Params, ArrayType, MissingRenderer } from "./interface";

export class QueryParamSerializer<T extends ValueSerializer<any>[]> {
  private serializers: T;

  constructor(serializers: T) {
    this.serializers = serializers;
  }

  /**
   * 
   * @param params Items to serialyze
   * @param first Is it the first part of the url ? or are there previous params already ?
   * @returns the formated string
   */
  serialize(params: Params<ArrayType<T>>, first: boolean = true) {
    const s = Object.keys(params).map(key => {
      const value = params[key];
      if (value !== undefined && value !== null) {
        // if we could create custom serializers at compile time it would be more optimized
        const serializer = this.serializers.find(s => s.shouldSerialize(value));
        if (serializer) {
          const serialized = serializer.serialize(value, key);
          const updated = serializer.updateKey(key);
          if (updated === "" ) {
            // Serializer handled its own key format (e.g., arrays)
            return serialized;
          }
          const k = updated === false ? key : updated;
          return `${k}=${serialized}`;
        } else {
          throw new MissingRenderer(`Missing serializer for "${value}"`);
        }
      }
      return null;
    }).filter((v): v is string => v !== null);
    if (s.length > 0) {
      if (first) {
        return `?${s.join("&")}`;
      } else {
        return `&${s.join("&")}`;
      }
    } else {
      return "";
    }
  }
}
