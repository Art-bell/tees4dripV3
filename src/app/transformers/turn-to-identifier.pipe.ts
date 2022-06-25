import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'turnIntoIdentifier'})
export class TurnIntoIdentifierPipe implements PipeTransform {
  transform(value: string): string {
    return value.toLowerCase().replace(/\s/g, "-");
  }
}