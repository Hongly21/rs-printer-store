import { NextResponse } from 'next/server';
import { Order } from '@/types';

function escapeHtml(text?: string | number): string {
  if (text === undefined || text === null) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function POST(req: Request) {
  try {
    let order: Order | null = null;
    const uploadedFiles: { key: string; file: File }[] = [];

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const orderRaw = formData.get('order');
      if (orderRaw && typeof orderRaw === 'string') {
        order = JSON.parse(orderRaw) as Order;
      }

      // Collect all attached files
      for (const [key, value] of formData.entries()) {
        if (key.startsWith('file_') && value instanceof File && value.size > 0) {
          uploadedFiles.push({ key, file: value });
        }
      }
    } else {
      // Fallback: JSON body
      order = (await req.json()) as Order;
    }

    if (!order) {
      return NextResponse.json({ error: 'Missing order payload' }, { status: 400 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_GROUP_CHAT_ID || process.env.TELEGRAM_ADMIN_CHAT_ID;

    // If bot credentials are not configured, log clear guidance for developer and continue
    if (!botToken || !chatId) {
      console.warn(
        '[RS Printer Telegram API] Order placed successfully, but TELEGRAM_BOT_TOKEN or TELEGRAM_GROUP_CHAT_ID is not configured in .env.local'
      );
      return NextResponse.json({
        success: true,
        orderNumber: order.orderNumber,
        notified: false,
        message: 'Order recorded. Configure TELEGRAM_BOT_TOKEN and TELEGRAM_GROUP_CHAT_ID in .env.local to enable real-time Telegram group alerts.',
      });
    }

    // 1. Build Item List HTML in Khmer & English for Telegram
    const itemsListHtml = order.items
      .map((item, idx) => {
        const specs: string[] = [];
        const mat = item.config.materialNameKm || item.config.materialName;
        if (mat) specs.push(`   • សម្ភារៈ៖ <b>${escapeHtml(mat)}</b>`);
        const sz = item.config.sizeNameKm || item.config.sizeName;
        if (sz) specs.push(`   • ទំហំ៖ <b>${escapeHtml(sz)}</b>`);
        const fn = item.config.finishingNameKm || item.config.finishingName;
        if (fn) specs.push(`   • ការកាត់/ស្រោប៖ <b>${escapeHtml(fn)}</b>`);
        specs.push(`   • ចំនួន៖ <b>${item.config.quantity} pcs</b>`);
        specs.push(`   • តម្លៃ៖ <b>$${item.totalPrice.toFixed(2)}</b>`);
        if (item.config.designMode === 'preset') {
          const presetName = item.config.presetNameKm || item.config.presetName || item.file?.name || 'ស្ទីគ័រមានស្រាប់';
          const customNote = item.config.isCustomized ? ' <i>(បានកែសម្រួលក្នុង Studio)</i>' : ' <i>(1-Click Order)</i>';
          specs.push(`   • ម៉ូដស្ទីគ័រ៖ <b>ស្ទីគ័រមានស្រាប់: ${escapeHtml(presetName)}</b>${customNote}`);
        } else if (item.file?.name) {
          specs.push(`   • ឯកសារ Artwork៖ <b>រូបផ្ទាល់ខ្លួន: ${escapeHtml(item.file.name)}</b>`);
        }
        if (item.config.notes) {
          specs.push(`   • ចំណាំ៖ <i>${escapeHtml(item.config.notes)}</i>`);
        }

        const prodName = item.productNameKm
          ? `${escapeHtml(item.productNameKm)} (${escapeHtml(item.productName)})`
          : escapeHtml(item.productName);

        return `<b>${idx + 1}. ${prodName}</b>\n${specs.join('\n')}`;
      })
      .join('\n\n');

    // 2. Format delivery text in Khmer
    let deliveryDetail = '';
    if (order.delivery.method === 'pickup') {
      deliveryDetail = '• <b>មកយកផ្ទាល់នៅហាង (Shop Pickup)</b>\n• <b>ទីតាំង៖</b> RS Printer សាខាផ្លូវ 2004 ភ្នំពេញ';
    } else if (order.delivery.carrier === 'vireak_buntham') {
      deliveryDetail = `• <b>វីរៈ ប៊ុនថាំ អេចប្រេស (VET Express)</b>\n• <b>សាខា/Campus៖</b> <b>${escapeHtml(order.delivery.vireakBranchName || order.delivery.address || 'Central Hub')}</b>${
        order.delivery.vireakBranchNote ? `\n• <b>ចំណាំទីតាំង៖</b> ${escapeHtml(order.delivery.vireakBranchNote)}` : ''
      }\n• <b>លេខទទួលទំនិញ (VET Phone)៖</b> <code>${escapeHtml(order.delivery.recipientPhone || order.customer.phone)}</code>`;
    } else if (order.delivery.carrier === 'phnom_penh_door') {
      deliveryDetail = `• <b>សេវាដឹកជញ្ជូនដល់ទីកន្លែង រាជធានីភ្នំពេញ (Door-to-Door)</b>\n• <b>អាសយដ្ឋាន៖</b> ${escapeHtml(order.delivery.address || 'N/A')}${
        order.delivery.recipientPhone ? `\n• <b>លេខទូរស័ព្ទទទួល៖</b> <code>${escapeHtml(order.delivery.recipientPhone)}</code>` : ''
      }`;
    } else {
      deliveryDetail = `• <b>សេវាដឹកជញ្ជូនរហ័ស (Courier)៖</b> ${escapeHtml(order.delivery.otherCourierName || 'Express Courier')}\n• <b>ទីតាំង/បញ្ជរ៖</b> ${escapeHtml(order.delivery.address || 'N/A')}${
        order.delivery.recipientPhone ? `\n• <b>លេខទូរស័ព្ទទទួល៖</b> <code>${escapeHtml(order.delivery.recipientPhone)}</code>` : ''
      }`;
    }

    const customerTelegram = order.customer.telegram
      ? order.customer.telegram.startsWith('@')
        ? order.customer.telegram
        : `@${order.customer.telegram}`
      : 'មិនបានបញ្ជាក់';

    const cleanTelegramUsername = customerTelegram !== 'មិនបានបញ្ជាក់'
      ? customerTelegram.replace('@', '').trim()
      : null;

    const notesBlock = order.customer.notes
      ? `\n<b>ចំណាំបន្ថែមពីអតិថិជន៖</b>\n<i>"${escapeHtml(order.customer.notes)}"</i>\n`
      : '';

    const formattedDate = new Date(order.createdAt).toLocaleString('km-KH', {
      timeZone: 'Asia/Phnom_Penh',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // 3. Compose rich Telegram Message HTML in Khmer
    const messageText = `<b>【ការបញ្ជាទិញថ្មី / NEW ORDER - #${escapeHtml(order.orderNumber)}】</b>
<i>${formattedDate}</i>
────────────────────────
<b>[ព័ត៌មានអតិថិជន / Customer]</b>
• ឈ្មោះ៖ <b>${escapeHtml(order.customer.fullName)}</b>
• លេខទូរស័ព្ទ៖ <code>${escapeHtml(order.customer.phone)}</code>
• Telegram៖ ${cleanTelegramUsername ? `<b>@${escapeHtml(cleanTelegramUsername)}</b>` : '<i>មិនបានបញ្ជាក់</i>'}${notesBlock}
────────────────────────
<b>[មុខទំនិញបោះពុម្ព / Items (${order.items.length} មុខ)]</b>
${itemsListHtml}
────────────────────────
<b>[ការដឹកជញ្ជូន / Delivery]</b>
${deliveryDetail}
────────────────────────
<b>[សង្ខេបការទូទាត់ប្រាក់ / Payment]</b>
• សរុបទំនិញ (Subtotal)៖ <b>$${order.subtotal.toFixed(2)}</b>
• ថ្លៃដឹកជញ្ជូន (Delivery)៖ <b>${order.deliveryFee === 0 ? 'ឥតគិតថ្លៃ (FREE)' : `$${order.deliveryFee.toFixed(2)}`}</b>
• <b>សរុបរួមត្រូវទូទាត់ (TOTAL DUE)៖ <code>$${order.total.toFixed(2)}</code></b>
• វិធីបង់ប្រាក់៖ <b>${escapeHtml(order.payment.methodName)}</b>
• ស្ថានភាពបង់ប្រាក់៖ <b>${escapeHtml(order.payment.status.toUpperCase())}</b>
────────────────────────
<b>[ស្ថានភាពការងារ / Status: NEW ORDER]</b>`;

    // 4. Construct interactive Admin Action Buttons
    // Row 1: Direct contact button
    // Row 2: In-progress & Printing status buttons
    // Row 3: Mark completed button
    const inlineKeyboard: { text: string; url?: string; callback_data?: string }[][] = [];

    const contactRow: { text: string; url: string }[] = [];
    if (cleanTelegramUsername) {
      contactRow.push({
        text: `ឆាតទៅ @${cleanTelegramUsername}`,
        url: `https://t.me/${cleanTelegramUsername}`,
      });
    } else if (order.customer.phone) {
      const cleanPhone = order.customer.phone.replace(/[^\d]/g, '');
      const internationalPhone = cleanPhone.startsWith('0')
        ? `855${cleanPhone.slice(1)}`
        : cleanPhone;
      contactRow.push({
        text: `ឆាត Telegram (${escapeHtml(order.customer.phone)})`,
        url: `https://t.me/+${internationalPhone}`,
      });
    }

    if (contactRow.length > 0) {
      inlineKeyboard.push(contactRow);
    }

    // Row 2: Step tracking buttons for Admins
    inlineKeyboard.push([
      {
        text: 'កំពុងដំណើរការ (Processing)',
        callback_data: `status:processing:${order.orderNumber}`,
      },
      {
        text: 'កំពុងព្រីន (Printing)',
        callback_data: `status:printing:${order.orderNumber}`,
      },
    ]);

    // Row 3: Completed button
    inlineKeyboard.push([
      {
        text: 'សម្គាល់ថាបានរួចរាល់ (Mark Completed)',
        callback_data: `status:completed:${order.orderNumber}`,
      },
    ]);

    // 5. Send Order Notification Message to Telegram Group
    const tgSendMessageUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const sendMsgRes = await fetch(tgSendMessageUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: inlineKeyboard,
        },
      }),
    });

    const sendMsgData = await sendMsgRes.json();
    if (!sendMsgRes.ok) {
      console.error('[RS Printer Telegram API] Error sending text alert:', sendMsgData);
    }

    // 6. If artwork files were uploaded, send each document directly to the Telegram group
    if (uploadedFiles.length > 0) {
      const tgSendDocUrl = `https://api.telegram.org/bot${botToken}/sendDocument`;

      for (const { file } of uploadedFiles) {
        try {
          const docFormData = new FormData();
          docFormData.append('chat_id', chatId);
          docFormData.append('document', file, file.name);
          docFormData.append(
            'caption',
            `<b>[ឯកសារ Artwork សម្រាប់ការបញ្ជាទិញ #${escapeHtml(order.orderNumber)}]</b>\n` +
            `• ឈ្មោះឯកសារ៖ <b>${escapeHtml(file.name)}</b> (${(file.size / (1024 * 1024)).toFixed(2)} MB)\n` +
            `• អតិថិជន៖ <b>${escapeHtml(order.customer.fullName)}</b> (${escapeHtml(order.customer.phone)})`
          );
          docFormData.append('parse_mode', 'HTML');

          const docRes = await fetch(tgSendDocUrl, {
            method: 'POST',
            body: docFormData,
          });

          if (!docRes.ok) {
            const errData = await docRes.json();
            console.error('[RS Printer Telegram API] Error sending artwork document:', errData);
          }
        } catch (fileErr) {
          console.error('[RS Printer Telegram API] Failed to forward artwork file:', fileErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      notified: true,
      filesSent: uploadedFiles.length,
    });
  } catch (error: any) {
    console.error('[RS Printer Telegram API] Internal error handling order:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process order notification' },
      { status: 500 }
    );
  }
}
