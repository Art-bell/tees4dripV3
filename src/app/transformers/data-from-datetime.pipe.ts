import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateFromDatetime' })
export class DateFromDatetimePipe implements PipeTransform {
  transform(value: string): string {
    return value.split('T')[0];
  }
}
