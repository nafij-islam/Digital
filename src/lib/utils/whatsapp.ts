/**
 * Generates a safe WhatsApp deep link.
 * Note: NEVER include sensitive credentials (passwords, license keys) in the URL.
 */
export function generateWhatsAppOrderLink(
  phone: string,
  customerName: string,
  orderNumber: string,
  customStatusMessage?: string
): string {
  // Sanitize phone number (strip whitespace, dashes, plus if needed for api link)
  const cleanPhone = phone.replace(/[^0-9]/g, "");

  const message =
    customStatusMessage ||
    `Hello ${customerName}, your order #${orderNumber} is currently being processed. If you have any questions, feel free to let us know!`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}
