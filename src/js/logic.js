// Lógica de CampusFest: funciones puras, sin DOM.
// La app (app.js) y las pruebas (tests/) usan estas mismas funciones.

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Convierte "2026-11-24" en una fecha a mediodía para evitar problemas de zona horaria.
function toDate(dateStr) {
  return new Date(`${dateStr}T12:00:00`);
}

function pad(number) {
  return String(number).padStart(2, '0');
}

// ---------- Cupos ----------

export function spotsLeft(event) {
  // Evita devolver números negativos si registered > capacity
  return Math.max(0, event.capacity - event.registered);
}

export function isFull(event) {
  // Bloquea tanto en 0 como si hubiera sobrecupo
  return event.capacity - event.registered <= 0;
}

export function spotsLabel(event) {
  if (isFull(event)) {
    return 'Cupo lleno';
  }
  const left = spotsLeft(event);
  return left === 1 ? '1 lugar' : `${left} lugares`;
}

// ---------- Precio ----------

export function formatPrice(price) {
  return price === 0 ? 'Gratis' : `$${price}`;
}

// ---------- Fechas ----------

export function formatShortDate(dateStr) {
  const date = toDate(dateStr);
  // getMonth() es base 0, se suma 1 para obtener el mes real
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`;
}

export function weekdayName(dateStr) {
  return WEEKDAYS[toDate(dateStr).getDay()];
}

export function daysUntil(dateStr, todayStr) {
  return Math.round((toDate(dateStr) - toDate(todayStr)) / MS_PER_DAY);
}

export function countdownLabel(dateStr, todayStr) {
  const days = daysUntil(dateStr, todayStr);
  if (days < 0) {
    return 'Finalizado';
  }
  if (days === 0) {
    return 'Hoy';
  }
  if (days === 1) {
    return 'Mañana';
  }
  return `Faltan ${days} días`;
}

export function sortByDate(events) {
  // Compara directamente el formato YYYY-MM-DD para respetar año, mes y día
  return [...events].sort((a, b) => a.date.localeCompare(b.date));
}

// ---------- Búsqueda y filtros ----------

export function matchesSearch(event, query) {
  const text = `${event.title} ${event.venue} ${event.categoryLabel}`.toLowerCase();
  return text.includes(query.trim().toLowerCase());
}

export function filterEvents(events, { query = '', category = 'todas', day = null, onlyMine = false, mine = [] } = {}) {
  return events.filter((event) => {
    if (category !== 'todas' && event.category !== category) return false;
    if (day && event.date !== day) return false;
    if (onlyMine && !mine.includes(event.id)) return false;
    if (query && !matchesSearch(event, query)) return false;
    return true;
  });
}

function normalizeText(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function matchesSearch(event, query) {
  const text = normalizeText(`${event.title} ${event.venue} ${event.categoryLabel}`);
  return text.includes(normalizeText(query.trim()));
}