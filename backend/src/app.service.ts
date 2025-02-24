import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('Hello World!!!');
    return '<h1>This is simple E-Commercial API</h1>';
  }
}
