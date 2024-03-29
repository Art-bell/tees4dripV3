import { AdminOrder } from './interfaces';

export function getFormattedOrderTotalText(orderTotal: number) {
  if (!orderTotal) {
    return '$ -';
  }
  const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return USDollar.format(orderTotal);
}

export function getCardDeliveryText(order: AdminOrder) {
  return `${order.customerStreetAddress1}${
    order.customerStreetAddress2 ? ', ' + order.customerStreetAddress2 : ''
  }, ${order.customerCity}, ${order.customerZipCode}, ${order.customerCountry}`;
}
