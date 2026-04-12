import { Router } from 'express';
import { getAdminTicketDetail, getAdminTickets } from './ticket.controller';

const ticketRouter = Router();

ticketRouter.get('/admin', getAdminTickets);
ticketRouter.get('/admin/:id', getAdminTicketDetail);

export default ticketRouter;