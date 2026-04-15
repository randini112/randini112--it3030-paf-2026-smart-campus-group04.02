package com.smartcampus.ticketing.service;

import com.smartcampus.ticketing.model.Ticket;
import java.util.List;

public interface TicketService {
    Ticket createTicket(Ticket ticket);
    List<Ticket> getAllTickets();
    Ticket getTicketById(String id);
    Ticket updateTicket(String id, Ticket ticketDetails);
    void deleteTicket(String id);
    List<Ticket> getTicketsByStatus(String status);
}