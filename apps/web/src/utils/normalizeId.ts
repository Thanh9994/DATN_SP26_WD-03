type PlainObject = Record<string, any>;

const isPlainObject = (value: unknown): value is PlainObject =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

export const normalizeIdDeep = <T>(input: T): T => {
  if (Array.isArray(input)) {
    return input.map(normalizeIdDeep) as any;
  }

  if (isPlainObject(input)) {
    const obj = { ...input } as PlainObject;

    // Duyệt qua các thuộc tính con trước (Đệ quy)
    for (const key in obj) {
      obj[key] = normalizeIdDeep(obj[key]);
    }

    // Xử lý logic gán _id
    const idValue = obj._id ?? obj.id;
    if (idValue !== undefined) {
      obj._id = idValue; // Đảm bảo luôn có _id
    }

    return obj as T;
  }

  return input;
};
