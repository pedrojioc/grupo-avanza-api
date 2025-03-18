export function currencyFormat(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
  })
    .format(amount)
    .replace(/(\.|,)00$/g, '')
}
