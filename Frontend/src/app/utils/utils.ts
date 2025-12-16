import moment from "moment";

export function maskField(value: string, mask: string) {
  let newText = '';
  let text = value;

  for (let i = 0, j = 0; i < text.length && i < mask.length; i++) {
    if (!/\d/.test(text[i])) {
      continue;
    }

    if (mask[j] === '9') {
      newText += text[i];
      j++;
    }
    else {
      newText += mask[j];

      if (mask[j + 1] == ' ') {
        newText += ' ';
        j++;
      }

      newText += text[i];
      j += 2;
    }
  }

  return newText;
};

export function currency(value: string) {
  const numeric = value.replace(/\D/g, '');

  if (!numeric) return 'R$ 0,00';

  const number = parseFloat(numeric) / 100;

  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function parseCurrency(value: string | number): number {
  if (typeof value === 'number') {
    return value;
  }

  const cleaned = value
    .replace('R$', '')
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(',', '.');

  const parsed = Number(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

export function formatCurrencyNumber(value: number | string) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export function formatDate(value: Date | string | null, format: string = "DD/MM/YYYY"): string {
  if (!value) return "";
  return moment(value).locale("pt-br").format(format);
};

export const removeCurrencyMask = (value: string) => {
  return value.replace(/[R$\s.]/g, "").replace(",", ".")
};


export function formatCurrencyBRL(value: string) {
  const numeric = value.replace(/[^\d.,]/g, '');

  if (!numeric) return 'R$ 0,00';

  const number = parseFloat(numeric.replace(',', '.'));

  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const handleSanitizeQuantity = (value: string): string => {
  if (!value) return "";

  let sanitized = value.replace(/[^0-9.,]/g, "");

  sanitized = sanitized.replace(",", ".");

  const parts = sanitized.split(".");
  if (parts.length > 2) {
    sanitized = parts[0] + "." + parts.slice(1).join("");
  }

  if (sanitized.includes(".")) {
    const [intPart, decPart] = sanitized.split(".");
    sanitized = intPart + "." + decPart.slice(0, 3);
  }

  return sanitized;
};
