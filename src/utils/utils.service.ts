import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
@Injectable()
export class UtilsService {
  formatsToBrazilianLocalDateTime() {
    const date = format(new Date(), 'dd/MM/yyyy HH:mm:ss');
    return date;
  }
}
