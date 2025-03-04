import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class PagingDto {
  @IsNumber()
  @Min(1)
  page: number = 1;

  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @IsNumber()
  @Min(0)
  @IsOptional()
  total?: number = 0;
}
