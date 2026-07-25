import { randomBytes } from "crypto";
import slugify from "slugify";

export const generateUniqueSlug = (title: string) => {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
  });

  const suffix = () => randomBytes(3).toString("hex");

  let slug = `${baseSlug}-${suffix()}`;

  return slug;
};
