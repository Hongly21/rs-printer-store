import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN not configured' }, { status: 400 });
    }

    const body = await req.json();

    // Handle interactive button callback queries from Telegram
    if (body.callback_query) {
      const { id, from, message, data } = body.callback_query;

      if (!data || !data.startsWith('status:')) {
        return NextResponse.json({ ok: true });
      }

      const parts = data.split(':');
      const action = parts[1]; // 'processing' | 'printing' | 'completed'
      const orderNumber = parts[2] || '';

      const adminName = from.username ? `@${from.username}` : [from.first_name, from.last_name].filter(Boolean).join(' ') || 'Admin';

      const timeStr = new Date().toLocaleString('km-KH', {
        timeZone: 'Asia/Phnom_Penh',
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'short',
      });

      let statusLabel = '';
      let statusBadge = '';
      let nextButtons: { text: string; url?: string; callback_data?: string }[][] = [];

      // Extract existing contact button if present
      const existingKeyboard = message?.reply_markup?.inline_keyboard || [];
      const contactRow = existingKeyboard.length > 0 ? existingKeyboard[0] : [];

      if (action === 'completed') {
        statusLabel = 'បានបញ្ចប់ (Completed)';
        statusBadge = '<b>[បានបញ្ចប់រួចរាល់ / COMPLETED]</b>';
        nextButtons = [
          contactRow,
          [
            { text: '[បានបញ្ចប់រួចរាល់ / COMPLETED]', callback_data: `status:noop:${orderNumber}` },
          ],
          [
            { text: 'ប្តូរទៅកំពុងព្រីនវិញ (Revert to Printing)', callback_data: `status:printing:${orderNumber}` },
          ],
        ];
      } else if (action === 'printing') {
        statusLabel = 'កំពុងព្រីន (Printing)';
        statusBadge = '<b>[កំពុងបោះពុម្ព / PRINTING]</b>';
        nextButtons = [
          contactRow,
          [
            { text: 'កំពុងព្រីន...', callback_data: `status:noop:${orderNumber}` },
          ],
          [
            { text: 'សម្គាល់ថាបានរួចរាល់ (Mark Completed)', callback_data: `status:completed:${orderNumber}` },
          ],
        ];
      } else if (action === 'processing') {
        statusLabel = 'កំពុងដំណើរការ (Processing)';
        statusBadge = '<b>[កំពុងរៀបចំការងារ / PROCESSING]</b>';
        nextButtons = [
          contactRow,
          [
            { text: 'កំពុងព្រីន (Printing)', callback_data: `status:printing:${orderNumber}` },
          ],
          [
            { text: 'សម្គាល់ថាបានរួចរាល់ (Mark Completed)', callback_data: `status:completed:${orderNumber}` },
          ],
        ];
      } else if (action === 'noop') {
        // Just answer callback
        await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callback_query_id: id,
            text: `ការបញ្ជាទិញ #${orderNumber} កំពុងស្ថិតក្នុងស្ថានភាពនេះស្រាប់`,
          }),
        });
        return NextResponse.json({ ok: true });
      }

      // 1. Answer Telegram callback query (shows popup toast to admin)
      await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query_id: id,
          text: `#${orderNumber}: ${statusLabel} ដោយ ${adminName}`,
          show_alert: false,
        }),
      });

      // 2. Edit Telegram message text and update buttons
      if (message?.text || message?.caption) {
        const rawText = message.text || message.caption || '';
        // Replace or append status line
        let updatedText = rawText;
        if (updatedText.includes('ស្ថានភាពការងារ')) {
          const lines = updatedText.split('\n');
          const filtered = lines.filter((l: string) => !l.includes('ស្ថានភាពការងារ') && !l.includes('កែប្រែដោយ'));
          updatedText = filtered.join('\n') + `\n[ស្ថានភាពការងារ]៖ ${statusBadge}\n[កែប្រែដោយ]៖ ${adminName} (${timeStr})`;
        } else {
          updatedText += `\n────────────────────────\n[ស្ថានភាពការងារ]៖ ${statusBadge}\n[កែប្រែដោយ]៖ ${adminName} (${timeStr})`;
        }

        await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: message.chat.id,
            message_id: message.message_id,
            text: updatedText,
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: nextButtons,
            },
          }),
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('[Telegram Webhook Error]:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'active',
    service: 'RS Printer Telegram Bot Webhook Handler',
    features: ['callback_query_order_status', 'mark_completed', 'mark_printing'],
  });
}
