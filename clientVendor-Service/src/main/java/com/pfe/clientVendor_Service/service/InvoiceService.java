package com.pfe.clientVendor_Service.service;

import com.pfe.clientVendor_Service.entity.Invoice;
import com.pfe.clientVendor_Service.repository.InvoiceRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceService {
    private final InvoiceRepository invoiceRepo;

    public Invoice createInvoice(Invoice invoice) {
        return invoiceRepo.save(invoice);
    }
    public Invoice getInvoiceById(String id) {
        return invoiceRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Invoice not found with id: " + id));
    }

    public List<Invoice> getAllInvoices() {
        return invoiceRepo.findAll();
    }

    public Invoice updateInvoice(String id, Invoice updatedInvoice) {
        Invoice existingInvoice = getInvoiceById(id);
        // Update fields (consider using BeanUtils.copyProperties or MapStruct)

        existingInvoice.setInvoiceDate(updatedInvoice.getInvoiceDate());
        existingInvoice.setDueDate(updatedInvoice.getDueDate());
        existingInvoice.setTotalAmount(updatedInvoice.getTotalAmount());
        existingInvoice.setStatus(updatedInvoice.getStatus());
        existingInvoice.setItems(updatedInvoice.getItems());
        return invoiceRepo.save(existingInvoice);
    }

    public void deleteInvoice(String id) {
        Invoice invoice = getInvoiceById(id);
        invoiceRepo.delete(invoice);
    }
}