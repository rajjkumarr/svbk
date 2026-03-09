import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { instanceToPlain } from 'class-transformer';

export interface Response<T> {
  data: T;
  timestamp: string;
}

/**
 * Wraps successful responses in a consistent shape. Use @Exclude() on entities to control serialization.
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data: T) => ({
        data: instanceToPlain(data) as T,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
