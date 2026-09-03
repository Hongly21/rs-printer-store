import { Order } from '@/types';
import { shopConfig } from '@/data/shop';
import { formatPrice } from './utils';

export function formatTelegramOrderMessage(order: Order): string {
  const itemsText = order.items
    .map((item, idx) => {
      const details: string[] = [];
      if (item.config.materialName) details.push(`   Material: ${item.config.materialName}`);
      if (item.config.sizeName) details.push(`   Size: ${item.config.sizeName}`);
      if (item.config.finishingName) details.push(`   Finishing: ${item.config.finishingName}`);
      if (item.file) details.push(`   Artwork: ${item.file.name}`);
      details.push(`   Quantity: ${item.config.quantity}`);
      details.push(`   Price: ${formatPrice(item.totalPrice)}`);

      return `${idx + 1}. ${item.productName}\n${details.join('\n')}`;
    })
    .join('\n\n');

  const deliveryText =
    order.delivery.method === 'pickup'
      ? `Pickup\nLocation: ${shopConfig.pickupLocationDetail}`
      : `Delivery\nAddress:\n${order.delivery.address || 'N/A'}${
          order.delivery.city ? `, ${order.delivery.city}` : ''
        }\nDelivery Fee: ${formatPrice(order.deliveryFee)}`;

  const customerTelegram = order.customer.telegram
    ? order.customer.telegram.startsWith('@')
      ? order.customer.telegram
      : `@${order.customer.telegram}`
    : 'Not provided';

  const notesSection = order.customer.notes
    ? `\n\n[NOTES]\n${order.customer.notes}`
    : '';

  return `[RS PRINTER - NEW ORDER]

Order: #${order.orderNumber}
Date: ${new Date(order.createdAt).toLocaleString()}

[CUSTOMER]
Name: ${order.customer.fullName}
Phone: ${order.customer.phone}
Telegram: ${customerTelegram}

[ITEMS]
${itemsText}

[DELIVERY]
${deliveryText}

[TOTAL]
Subtotal: ${formatPrice(order.subtotal)}
Delivery: ${formatPrice(order.deliveryFee)}
TOTAL: ${formatPrice(order.total)}

[PAYMENT]
Method: ${order.payment.methodName}
Status: ${order.payment.status.toUpperCase()}${notesSection}`;
}

export function generateTelegramShareLink(order: Order): string {
  const message = formatTelegramOrderMessage(order);
  const encoded = encodeURIComponent(message);
  const username = shopConfig.telegramBotOrUser.replace(/^@/, '');
  return `https://t.me/${username}?text=${encoded}`;
}
