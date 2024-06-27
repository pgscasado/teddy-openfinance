import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(PrismaClientKnownRequestError)
export class PrismaFilter<T extends PrismaClientKnownRequestError>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let status: HttpStatus;
    let message: string;
    const details = exception.meta;
    switch (exception.code) {
      case 'P2002': // Unique constraint failed
        status = HttpStatus.CONFLICT;
        message = 'Unique constraint failed';
        break;
      case 'P2025': // Record not found
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        break;
      case 'P2003': // Foreign key constraint failed
        status = HttpStatus.BAD_REQUEST;
        message = 'Foreign key constraint failed';
        break;
      case 'P2014': // Related record not found
        status = HttpStatus.NOT_FOUND;
        message = 'Related record not found';
        break;
      case 'P2004': // Constraint failed on the database
        status = HttpStatus.BAD_REQUEST;
        message = 'Constraint failed on the database';
        break;
      default: // Default case for other Prisma errors
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Internal server error';
        break;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message,
      details,
      path: request.url,
    });
  }
}
