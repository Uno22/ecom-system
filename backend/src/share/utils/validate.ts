import { ErrDataEmpty } from './error';
import { AppError } from '../app-error';
import { DataEmptyException } from '../exceptions';

export const validateDataObjectEmpty = (object: any) => {
  if (Object.keys(object).length === 0) {
    throw new DataEmptyException();
  }
};
