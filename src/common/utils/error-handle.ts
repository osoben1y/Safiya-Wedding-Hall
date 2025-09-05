import { HttpException, InternalServerErrorException } from '@nestjs/common';

export const ErrorHender = (error: any) => {
  if (error?.response) {
    throw new HttpException(
      error?.response?.message,
      error?.response?.statusCode,
    );
  } else {
    throw new InternalServerErrorException(error.message);
  }
};