import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseErrorDto {
  @ApiProperty({ example: 'DATA_ERROR', description: 'The code of error' })
  code: string;

  @ApiProperty({
    example: 'Data not found',
    description: 'The details of error',
  })
  details: string;

  constructor(code: string, details: string) {
    this.code = code;
    this.details = details;
  }
}

export class ApiResponseDto<T> {
  @ApiProperty({ example: false, description: 'The result of response' })
  success: boolean;

  @ApiProperty({
    example: {},
    description: 'The data of response',
    nullable: true,
  })
  data: T | null;

  @ApiProperty({
    example: 'Failed to retrieve data',
    description: 'The message of response',
  })
  message: string;

  @ApiProperty({ example: 401, description: 'The status code of response' })
  statusCode: number;

  @ApiProperty({
    type: ApiResponseErrorDto,
    nullable: true,
    description: 'Error details or null if no error',
  })
  error: { code: string; details: string } | null;

  constructor(
    success: boolean,
    data: T | null = null,
    message: string = 'Get data successfully',
    statusCode: number = 200,
    error: { code: string; details: string } | null = null,
  ) {
    this.success = success;
    this.data = data;
    this.message = message || 'Get data successfully';
    this.statusCode = statusCode;
    this.error = error;
  }
}
