// src/lib/whatsapp.ts
export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export interface QuoteRequest {
  /** null cuando el cliente eligió "Otra" marca: el modelo ya la identifica. */
  brand: string | null;
  model: string;
  problem: string;
}

export function buildQuoteMessage({ brand, model, problem }: QuoteRequest): string {
  // El placeholder sugiere "Samsung A54": evita "*Samsung Samsung A54*" si el modelo ya nombra la marca.
  const isBrandRedundant = brand === null || model.toLowerCase().includes(brand.toLowerCase());
  const device = isBrandRedundant ? model : `${brand} ${model}`;
  return [
    `¡Hola VegaTech! 👋 Estuve viendo su web y me gustaría consultarles por mi *${device}*.`,
    `Presenta el siguiente problema: *${problem}*`,
    "¿Podrían orientarme con un presupuesto estimado o decirme cómo seguimos? ¡Muchas gracias!",
  ].join("\n\n");
}
