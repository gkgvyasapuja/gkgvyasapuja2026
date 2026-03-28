export type JsType =
  | "array"
  | "object"
  | "null"
  | "undefined"
  | "string"
  | "number"
  | "boolean"
  | "bigint"
  | "symbol"
  | "function"
  | "unknown";

export interface TypeInfo {
  type: JsType;
  isEmpty: boolean;
  isValid: boolean;
}

export const getTypeAndContentInfo = (value: unknown): TypeInfo => {
  if (Array.isArray(value)) {
    return {
      type: "array",
      isEmpty: value.length === 0,
      isValid: value.length > 0,
    };
  }

  if (value === null) {
    return {
      type: "null",
      isEmpty: true,
      isValid: false,
    };
  }

  const type = typeof value;

  switch (type) {
    case "object":
      return {
        type: "object",
        isEmpty: Object.keys(value as object).length === 0,
        isValid: Object.keys(value as object).length > 0,
      };

    case "string":
      const trimmed = (value as string).trim();
      return {
        type: "string",
        isEmpty: trimmed === "",
        isValid: trimmed.length > 0,
      };

    case "number":
      return {
        type: "number",
        isEmpty: false,
        isValid: !Number.isNaN(value),
      };

    case "boolean":
    case "bigint":
    case "symbol":
    case "function":
      return {
        type,
        isEmpty: false,
        isValid: true,
      };

    case "undefined":
      return {
        type: "undefined",
        isEmpty: true,
        isValid: false,
      };

    default:
      return {
        type: "unknown",
        isEmpty: true,
        isValid: false,
      };
  }
};
