// scripts/check-whatsapp.ts — `npm test`
import assert from "node:assert/strict";
import { buildQuoteMessage, buildWhatsAppUrl } from "../src/lib/whatsapp.ts";

assert.equal(
  buildWhatsAppUrl("5492617759046", "Hola Vegatech, quiero consultar por la reparación de mi celular."),
  "https://wa.me/5492617759046?text=Hola%20Vegatech%2C%20quiero%20consultar%20por%20la%20reparaci%C3%B3n%20de%20mi%20celular.",
  "debe coincidir con el link que el sitio usaba hardcodeado",
);

const quote = (device: string, problem: string): string =>
  `¡Hola VegaTech! 👋 Estuve viendo su web y me gustaría consultarles por mi *${device}*.\n\n` +
  `Presenta el siguiente problema: *${problem}*\n\n` +
  "¿Podrían orientarme con un presupuesto estimado o decirme cómo seguimos? ¡Muchas gracias!";

assert.equal(
  buildQuoteMessage({ brand: "Apple", model: "iPhone 11", problem: "Pantalla Rota" }),
  quote("Apple iPhone 11", "Pantalla Rota"),
);
assert.equal(
  buildQuoteMessage({ brand: "Samsung", model: "samsung A54", problem: "No Enciende" }),
  quote("samsung A54", "No Enciende"),
  "marca redundante",
);
assert.equal(
  buildQuoteMessage({ brand: null, model: "Nokia G21", problem: "Otro problema" }),
  quote("Nokia G21", "Otro problema"),
  "marca Otra",
);

// Emoji (par sustituto UTF-16) y saltos de párrafo deben sobrevivir al encoding del link.
const url = buildWhatsAppUrl("5492617759046", buildQuoteMessage({ brand: "Apple", model: "iPhone 11", problem: "Pantalla Rota" }));
assert.ok(url.includes("%F0%9F%91%8B"), "👋 codificado en UTF-8");
assert.ok(url.includes("%0A%0APresenta"), "párrafos separados por \\n\\n");
assert.equal(new URL(url).searchParams.get("text"), quote("Apple iPhone 11", "Pantalla Rota"), "ida y vuelta sin pérdida");
console.log("whatsapp: ok");
