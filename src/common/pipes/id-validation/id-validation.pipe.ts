import { ArgumentMetadata, BadRequestException, Injectable, ParseIntPipe, PipeTransform } from '@nestjs/common';

@Injectable()
export class IdValidationPipe extends ParseIntPipe {
  constructor (){
    super({
      exceptionFactory: () => {
        throw new BadRequestException('Invalid ID');
      },
    });
  }
}
