import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: unknown, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value, {
      enableImplicitConversion: true,
    });
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: errors.map((e: ValidationError) => ({
          property: e.property,
          constraints: e.constraints,
        })),
      });
    }
    return object;
  }

  private toValidate(metatype: unknown): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype as (typeof types)[number]);
  }
}
