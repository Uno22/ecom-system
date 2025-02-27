import { DataEmptyException } from '../exceptions';

export const validateDataObjectEmpty = (object: any) => {
  if (Object.keys(object).length === 0) {
    throw new DataEmptyException();
  }
};
