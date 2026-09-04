import { Order } from '@/types';
import { shopConfig } from '@/data/shop';
import { formatPrice } from './utils';

export function formatTelegramOrderMessage(order: Order): string {
  const itemsText = order.items
    .map((item, idx) => {
      const details: string[] = [];
      const mat = item.config.materialNameKm || item.config.materialName;
      if (mat) details.push(`   • សម្ភារៈ (Material): ${mat}`);
      const sz = item.config.sizeNameKm || item.config.sizeName;
      if (sz) details.push(`   • ទំហំ (Size): ${sz}`);
      const fn = item.config.finishingNameKm || item.config.finishingName;
      if (item.config.designMode === 'preset') {
        const presetName = item.config.presetNameKm || item.config.presetName || item.file?.name || 'ស្ទីគ័រមានស្រាប់';
        const customNote = item.config.isCustomized ? ' (បានកែសម្រួលក្នុង Studio)' : ' (1-Click Ready)';
        details.push(`   • ម៉ូដស្ទីគ័រ: ស្ទីគ័រមានស្រាប់ - ${presetName}${customNote}`);
      } else if (item.file?.name) {
        details.push(`   • ឯកសារ Artwork: រូបផ្ទាល់ខ្លួន - ${item.file.name}`);
      }
      details.push(`   • ចំនួន: ${item.config.quantity} pcs`);
      details.push(`   • តម្លៃ: ${formatPrice(item.totalPrice)}`);
      if (item.config.notes) details.push(`   • ចំណាំ: ${item.config.notes}`);

      const prodName = item.productNameKm ? `${item.productNameKm} (${item.productName})` : item.productName;
      return `${idx + 1}. ${prodName}\n${details.join('\n')}`;
    })
    .join('\n\n');

  let deliveryText = '';
  if (order.delivery.method === 'pickup') {
    deliveryText = `• សេវាកម្ម: មកយកផ្ទាល់នៅហាង (Shop Pickup)\n• ទីតាំងហាង: ${shopConfig.pickupLocationDetailKm || shopConfig.pickupLocationDetail}\n• អាសយដ្ឋាន: ${shopConfig.addressKm || shopConfig.address}`;
  } else if (order.delivery.carrier === 'vireak_buntham') {
    deliveryText = `• សេវាកម្ម: វីរៈ ប៊ុនថាំ អេចប្រេស (VET Express)\n• សាខា/Campus: ${order.delivery.vireakBranchName || order.delivery.address || 'Central Hub'}${
      order.delivery.vireakBranchNote ? `\n• ចំណាំទីតាំង: ${order.delivery.vireakBranchNote}` : ''
    }\n• លេខទូរស័ព្ទទទួល: ${order.delivery.recipientPhone || order.customer.phone}\n• ថ្លៃដឹកជញ្ជូន: ${order.deliveryFee === 0 ? 'ឥតគិតថ្លៃ (FREE)' : formatPrice(order.deliveryFee)}`;
  } else if (order.delivery.carrier === 'phnom_penh_door') {
    deliveryText = `• សេវាកម្ម: ដឹកជញ្ជូនដល់ទីកន្លែង រាជធានីភ្នំពេញ (Door-to-Door)\n• អាសយដ្ឋាន: ${order.delivery.address || 'N/A'}${
      order.delivery.recipientPhone ? `\n• លេខទូរស័ព្ទទទួល: ${order.delivery.recipientPhone}` : ''
    }\n• ថ្លៃដឹកជញ្ជូន: ${order.deliveryFee === 0 ? 'ឥតគិតថ្លៃ (FREE)' : formatPrice(order.deliveryFee)}`;
  } else {
    deliveryText = `• សេវាកម្ម: ${order.delivery.otherCourierName || 'សេវាដឹកជញ្ជូនរហ័ស (Express Courier)'}\n• អាសយដ្ឋាន/បញ្ជរ: ${order.delivery.address || 'N/A'}${
      order.delivery.recipientPhone ? `\n• លេខទូរស័ព្ទទទួល: ${order.delivery.recipientPhone}` : ''
    }\n• ថ្លៃដឹកជញ្ជូន: ${order.deliveryFee === 0 ? 'ឥតគិតថ្លៃ (FREE)' : formatPrice(order.deliveryFee)}`;
  }

  const customerTelegram = order.customer.telegram
    ? order.customer.telegram.startsWith('@')
      ? order.customer.telegram
      : `@${order.customer.telegram}`
    : 'មិនបានបញ្ជាក់ (Not provided)';

  const notesSection = order.customer.notes
    ? `\n• ចំណាំបន្ថែមពីអតិថិជន: "${order.customer.notes}"`
    : '';

  const dateStr = new Date(order.createdAt).toLocaleString('km-KH', {
    timeZone: 'Asia/Phnom_Penh',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `【ការបញ្ជាទិញថ្មី - RS PRINTER】
លេខកុម្ម៉ង់ (Order ID): #${order.orderNumber}
កាលបរិច្ឆេទ: ${dateStr}
────────────────────────
[ព័ត៌មានអតិថិជន / Customer]
• ឈ្មោះ: ${order.customer.fullName}
• លេខទូរស័ព្ទ: ${order.customer.phone}
• Telegram: ${customerTelegram}${notesSection}
────────────────────────
[មុខទំនិញបោះពុម្ព / Items (${order.items.length} មុខ)]
${itemsText}
────────────────────────
[វិធីដឹកជញ្ជូន / Delivery]
${deliveryText}
────────────────────────
[សង្ខេបការទូទាត់ / Payment]
• សរុបទំនិញ (Subtotal): ${formatPrice(order.subtotal)}
• ថ្លៃដឹកជញ្ជូន: ${order.deliveryFee === 0 ? 'ឥតគិតថ្លៃ (FREE)' : formatPrice(order.deliveryFee)}
• សរុបរួមត្រូវទូទាត់ (TOTAL DUE): ${formatPrice(order.total)}
• វិធីបង់ប្រាក់: ${order.payment.methodName}
• ស្ថានភាព: រង់ចាំការត្រួតពិនិត្យ (PENDING)
────────────────────────
[ស្ថានភាពការងារ / Status: NEW ORDER]`;
}

export function generateTelegramShareLink(order: Order): string {
  const message = formatTelegramOrderMessage(order);
  const encoded = encodeURIComponent(message);
  const username = shopConfig.telegramBotOrUser.replace(/^@/, '');
  return `https://t.me/${username}?text=${encoded}`;
}
