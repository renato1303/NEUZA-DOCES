import QRCode from 'qrcode';

// Pix EMV QRCPS (Banco Central do Brasil)
function formatTLV(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

// CRC16-CCITT calculation for official Pix compliance
function calculateCRC16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export interface PixPayloadOptions {
  pixKey: string;
  merchantName?: string;
  merchantCity?: string;
  amount?: number;
  txId?: string;
  description?: string;
}

export function generatePixPayload({
  pixKey,
  merchantName = 'NEUZA DOCES',
  merchantCity = 'SAO PAULO',
  amount,
  txId = '***',
  description,
}: PixPayloadOptions): string {
  // Normalize merchant name (max 25 chars, uppercase, alphanumeric/spaces)
  const cleanName = merchantName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9 ]/g, '')
    .trim()
    .slice(0, 25)
    .toUpperCase() || 'NEUZA DOCES';

  // Normalize merchant city (max 15 chars, uppercase, alphanumeric/spaces)
  const cleanCity = merchantCity
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9 ]/g, '')
    .trim()
    .slice(0, 15)
    .toUpperCase() || 'SAO PAULO';

  // Format Pix key
  const cleanKey = pixKey.trim();

  // 00: Payload Format Indicator
  let payload = formatTLV('00', '01');

  // 01: Point of Initiation Method (12 = dynamic/defined value, 11 = static)
  payload += formatTLV('01', amount && amount > 0 ? '12' : '11');

  // 26: Merchant Account Information (Pix)
  let mai = formatTLV('00', 'br.gov.bcb.pix');
  mai += formatTLV('01', cleanKey);
  if (description) {
    const cleanDesc = description
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .slice(0, 40);
    mai += formatTLV('02', cleanDesc);
  }
  payload += formatTLV('26', mai);

  // 52: Merchant Category Code (0000 = standard)
  payload += formatTLV('52', '0000');

  // 53: Transaction Currency (986 = Real Brasileiro / BRL)
  payload += formatTLV('53', '986');

  // 54: Transaction Amount
  if (amount && amount > 0) {
    payload += formatTLV('54', amount.toFixed(2));
  }

  // 58: Country Code (BR)
  payload += formatTLV('58', 'BR');

  // 59: Merchant Name
  payload += formatTLV('59', cleanName);

  // 60: Merchant City
  payload += formatTLV('60', cleanCity);

  // 62: Additional Data Field Template (TxID / Identificador)
  const cleanTxId = (txId || '***')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 25) || '***';
  const addData = formatTLV('05', cleanTxId);
  payload += formatTLV('62', addData);

  // 63: CRC16 Checksum
  const payloadForCrc = payload + '6304';
  const crc = calculateCRC16(payloadForCrc);

  return payloadForCrc + crc;
}

export async function generatePixQrDataUrl(payload: string): Promise<string> {
  try {
    return await QRCode.toDataURL(payload, {
      width: 320,
      margin: 1,
      color: {
        dark: '#091129',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('Failed to generate local QR Code:', err);
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(
      payload
    )}`;
  }
}
