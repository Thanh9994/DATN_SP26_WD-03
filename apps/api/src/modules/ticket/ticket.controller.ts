import { Request, Response } from 'express';
import { ticketService } from './ticket.service';

export const getAdminTickets = async (req: Request, res: Response) => {
  try {
    const { keyword, status, cinemaId, date, page, limit } = req.query;

    const result = await ticketService.getAdminTickets({
      keyword: typeof keyword === 'string' ? keyword : '',
      status: typeof status === 'string' ? status : '',
      cinemaId: typeof cinemaId === 'string' ? cinemaId : '',
      date: typeof date === 'string' ? date : '',
      page: Number(page || 1),
      limit: Number(limit || 10),
    });

    return res.status(200).json({
      success: true,
      message: 'Lấy danh sách vé thành công',
      data: result.tickets,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error('getAdminTickets error:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Lỗi khi lấy danh sách vé',
    });
  }
};

export const getAdminTicketDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const ticket = await ticketService.getAdminTicketDetail(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy vé',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Lấy chi tiết vé thành công',
      data: ticket,
    });
  } catch (error: any) {
    console.error('getAdminTicketDetail error:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Lỗi khi lấy chi tiết vé',
    });
  }
};