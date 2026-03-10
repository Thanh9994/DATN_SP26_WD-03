const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD") // tách dấu khỏi chữ
    .replace(/[\u0300-\u036f]/g, "") // xoá dấu
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export default slugify;
