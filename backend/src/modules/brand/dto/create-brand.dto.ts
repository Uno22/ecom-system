import { ErrNameMustBeAtLeast2Characters } from 'src/share/model/error';
import { z } from 'zod';

export const CreateBrandDtoSchema = z.object({
  name: z.string().min(2, ErrNameMustBeAtLeast2Characters),
  image: z.string().optional(),
  description: z.string().optional(),
  tagLine: z.string().optional(),
});

export type CreateBrandDto = z.infer<typeof CreateBrandDtoSchema>;
