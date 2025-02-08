import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  formatsToBrazilianLocalDateTime() {
    const dateInBrazil = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date());

    return dateInBrazil;
  }
}
