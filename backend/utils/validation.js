export const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
export const isValidPassword = (password) =>
  typeof password === "string" &&
  password.trim() !== "" &&
  Buffer.byteLength(password, "utf8") <= 72;
export const isValidName = (name) => typeof name === "string" && name.trim() !== "";
export const normalizeGmail = (gmail) => gmail.trim().toLowerCase();
export const isValidGmail = (gmail) => {
  if (typeof gmail !== "string") {
    return false;
  }

  const normalizedGmail = normalizeGmail(gmail);
  return normalizedGmail.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedGmail);
};
