import { ErrNameMustBeAtLeast2Characters } from 'src/share/model/error';
import { z } from 'zod';

export const CondBrandDtoSchema = z.object({
  name: z.string().min(2, ErrNameMustBeAtLeast2Characters).optional(),
});

export type CondBrandDto = z.infer<typeof CondBrandDtoSchema>;
