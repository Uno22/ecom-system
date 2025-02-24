import { z } from 'zod';
import { ErrInvalidUUID } from './model/error';

export const ParamIdDtoSchema = z.object({
  id: z.string().uuid(ErrInvalidUUID),
});

export type ParamIdDto = z.infer<typeof ParamIdDtoSchema>;
