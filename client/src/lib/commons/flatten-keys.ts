export const flattenKeys = (obj: any, prefix = ""): string[] => {
  const keys: string[] = [];
  for (const key in obj) {
    if (obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      keys.push(...flattenKeys(obj[key], prefix ? `${prefix}.${key}` : key));
    } else {
      keys.push(prefix ? `${prefix}.${key}` : key);
    }
  }
  return keys;
};
