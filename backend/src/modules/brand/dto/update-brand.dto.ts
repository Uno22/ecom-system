import { ErrNameMustBeAtLeast2Characters } from 'src/share/model/error';
import { z } from 'zod';

export const UpdateBrandDtoSchema = z.object({
  name: z.string().min(2, ErrNameMustBeAtLeast2Characters).optional(),
  image: z.string().optional(),
  description: z.string().optional(),
  tagLine: z.string().optional(),
});

export type UpdateBrandDto = z.infer<typeof UpdateBrandDtoSchema>;
