import { IsString, IsUUID } from 'class-validator';

export class ParamIdDto {
  @IsString()
  @IsUUID()
  id: string;
}
