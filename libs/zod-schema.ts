import { z } from "zod";

export const FormCreateCategorySchema = z.object({
  name: z.string().min(1, "Kolom tidak boleh kosong !"),
  icon: z.string().optional(),
  slug: z.string().min(1, "Kolom tidak boleh kosong !"),
  master_id: z.string().min(1, "Kolom tidak boleh kosong !"),
});

export type FormCreateCategoryValues = z.infer<typeof FormCreateCategorySchema>;
