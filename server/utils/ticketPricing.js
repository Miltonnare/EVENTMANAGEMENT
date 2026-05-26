const getTicketTypeStatus = (ticketType) => {
  if (!ticketType.isActive) return 'expired';

  const now = new Date();
  if (ticketType.salesCloseDate && now > new Date(ticketType.salesCloseDate)) {
    return 'expired';
  }

  if (ticketType.quantity != null && ticketType.soldCount >= ticketType.quantity) {
    return 'sold_out';
  }

  return 'active';
};

const getCurrentPrice = (ticketType) => {
  const base = ticketType.price ?? 0;
  const dynamic = ticketType.dynamicPricing;

  if (!dynamic?.enabled || !ticketType.quantity) {
    return base;
  }

  const soldPercent = (ticketType.soldCount / ticketType.quantity) * 100;
  const tiers = Math.floor(soldPercent / 10);
  const increase = tiers * (dynamic.increasePerTenPercentSold || 0);
  let price = base + increase;

  if (dynamic.minPrice != null) price = Math.max(price, dynamic.minPrice);
  if (dynamic.maxPrice != null) price = Math.min(price, dynamic.maxPrice);

  return Math.round(price * 100) / 100;
};

const getAvailableQuantity = (ticketType) => {
  if (ticketType.quantity == null) return null;
  return Math.max(0, ticketType.quantity - ticketType.soldCount);
};

const formatTicketTypeForClient = (ticketType) => {
  const status = getTicketTypeStatus(ticketType);
  const currentPrice = getCurrentPrice(ticketType);
  const available = getAvailableQuantity(ticketType);

  return {
    _id: ticketType._id,
    event: ticketType.event,
    name: ticketType.name,
    category: ticketType.category,
    description: ticketType.description,
    price: ticketType.price,
    currentPrice,
    quantity: ticketType.quantity,
    soldCount: ticketType.soldCount,
    available,
    salesCloseDate: ticketType.salesCloseDate,
    dynamicPricing: ticketType.dynamicPricing,
    status,
    isActive: ticketType.isActive,
  };
};

module.exports = {
  getTicketTypeStatus,
  getCurrentPrice,
  getAvailableQuantity,
  formatTicketTypeForClient,
};
