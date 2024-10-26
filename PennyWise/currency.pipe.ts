import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(value: number, currencySign: string = '$', decimalPlaces: number = 2): string {
    if (isNaN(value)) return '';
    
    const formattedValue = value.toFixed(decimalPlaces);
    const [integerPart, decimalPart] = formattedValue.split('.');
    
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return `${currencySign}${formattedIntegerPart}${decimalPart ? '.' + decimalPart : ''}`;
  }
}
