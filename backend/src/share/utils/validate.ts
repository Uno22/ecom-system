import { validate } from 'uuid';
import { ErrDataEmpty, ErrInvalidUUID } from '../model/error';
import { AppError } from '../app-error';

export const isValidUUID = (id: string) => {
  return validate(id);
};

export const validateUUID = (id: string) => {
  if (!isValidUUID(id)) {
    throw AppError.from(ErrInvalidUUID, 401);
  }
};

export const validateDataObjectEmpty = (object: any) => {
  if (Object.keys(object).length === 0) {
    throw AppError.from(ErrDataEmpty, 401);
  }
};
