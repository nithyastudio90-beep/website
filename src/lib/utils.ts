import { RAW_WHATSAPP_NUMBER } from './constants';

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function buildWhatsAppLink(message?: string): string {
  const base = `https://wa.me/${RAW_WHATSAPP_NUMBER}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function buildPreFilledBookingMessage(details: {
  name?: string;
  phone?: string;
  service?: string;
  date?: string;
  location?: string;
  message?: string;
}): string {
  let text = `Hello Nithya Studio & Video,\n\nI would like to enquire about booking your services:\n`;
  if (details.name) text += `• Name: ${details.name}\n`;
  if (details.phone) text += `• Mobile: ${details.phone}\n`;
  if (details.service) text += `• Service: ${details.service}\n`;
  if (details.date) text += `• Event Date: ${details.date}\n`;
  if (details.location) text += `• Event Location: ${details.location}\n`;
  if (details.message) text += `• Additional Message: ${details.message}\n`;
  text += `\nPlease let me know your availability and package details. Thank you!`;
  return text;
}

export function buildServiceEnquiryMessage(serviceTitle: string): string {
  return `Hello Nithya Studio & Video, I am interested in your "${serviceTitle}" service. Could you please share more information regarding availability and consultation?`;
}

export function isValidIndianMobile(phone: string): boolean {
  // Cleans digits and checks for standard 10 digit Indian number (optionally prefixed with +91 or 0)
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.length === 10) return /^[6-9]\d{9}$/.test(cleaned);
  if (cleaned.length === 12 && cleaned.startsWith('91')) return /^[6-9]\d{9}$/.test(cleaned.slice(2));
  if (cleaned.length === 11 && cleaned.startsWith('0')) return /^[6-9]\d{9}$/.test(cleaned.slice(1));
  return false;
}

export function isValidEmail(email: string): boolean {
  if (!email) return true; // Email is optional in booking form
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
