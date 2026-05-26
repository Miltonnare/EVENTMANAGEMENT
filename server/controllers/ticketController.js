const asyncHandler = require('../middleware/asyncHandler');
const ticketService = require('../services/ticket.service');
const ticketTypeService = require('../services/ticketType.service');
const ApiError = require('../utils/ApiError');
const { sendMessageResponse, sendSuccess, sendData } = require('../utils/responseHelpers');

const handleError = (res, error) => {
  if (error instanceof ApiError) {
    return sendMessageResponse(res, error.statusCode, error.message);
  }
  return sendMessageResponse(res, 500, 'Server error', { error: error.message });
};

const listTicketTypes = asyncHandler(async (req, res) => {
  try {
    const types = await ticketTypeService.listTicketTypes(req.params.eventId);
    return sendSuccess(res, 200, { ticketTypes: types });
  } catch (error) {
    return handleError(res, error);
  }
});

const createTicketType = asyncHandler(async (req, res) => {
  try {
    const ticketType = await ticketTypeService.createTicketType(
      req.params.eventId,
      req.user._id,
      req.body
    );
    return sendSuccess(res, 201, { ticketType });
  } catch (error) {
    return handleError(res, error);
  }
});

const updateTicketType = asyncHandler(async (req, res) => {
  try {
    const ticketType = await ticketTypeService.updateTicketType(
      req.params.eventId,
      req.params.typeId,
      req.user._id,
      req.body
    );
    return sendSuccess(res, 200, { ticketType });
  } catch (error) {
    return handleError(res, error);
  }
});

const deleteTicketType = asyncHandler(async (req, res) => {
  try {
    const result = await ticketTypeService.deleteTicketType(
      req.params.eventId,
      req.params.typeId,
      req.user._id
    );
    return sendSuccess(res, 200, result);
  } catch (error) {
    return handleError(res, error);
  }
});

const purchaseTickets = asyncHandler(async (req, res) => {
  try {
    const { eventId, ticketTypeId, quantity } = req.body;
    const result = await ticketService.purchaseTickets(eventId, req.user._id, {
      ticketTypeId,
      quantity,
    });
    return sendSuccess(res, 201, {
      message: 'Tickets purchased successfully',
      purchase: result.purchase,
      tickets: result.tickets,
      ticketType: result.ticketType,
    });
  } catch (error) {
    return handleError(res, error);
  }
});

const getMyTickets = asyncHandler(async (req, res) => {
  try {
    const tickets = await ticketService.getUserTickets(req.user._id);
    return sendData(res, 200, { tickets });
  } catch (error) {
    return handleError(res, error);
  }
});

const getPurchaseHistory = asyncHandler(async (req, res) => {
  try {
    const purchases = await ticketService.getPurchaseHistory(req.user._id);
    return sendData(res, 200, { purchases });
  } catch (error) {
    return handleError(res, error);
  }
});

const getTicket = asyncHandler(async (req, res) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.ticketId, req.user._id);
    return sendSuccess(res, 200, { ticket });
  } catch (error) {
    return handleError(res, error);
  }
});

const downloadTicket = asyncHandler(async (req, res) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.ticketId, req.user._id);
    const payload = ticketService.buildTicketDownload(ticket);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="ticket-${ticket.ticketCode}.json"`
    );
    return res.status(200).json(payload);
  } catch (error) {
    return handleError(res, error);
  }
});

module.exports = {
  listTicketTypes,
  createTicketType,
  updateTicketType,
  deleteTicketType,
  purchaseTickets,
  getMyTickets,
  getPurchaseHistory,
  getTicket,
  downloadTicket,
};
