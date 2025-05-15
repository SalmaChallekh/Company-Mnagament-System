package com.pfe.clientVendor_Service.controller;


import com.pfe.clientVendor_Service.entity.Invoice;
import com.pfe.clientVendor_Service.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/finance/invoices")
public class InvoiceController {
    private final InvoiceService invoiceService;

    @PreAuthorize("hasAnyRole('FINANCE', 'ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<Invoice> createInvoice(@RequestBody Invoice invoice) {
        return new ResponseEntity<>(invoiceService.createInvoice(invoice), HttpStatus.CREATED);
    }
    @PreAuthorize("hasAnyRole('FINANCE', 'ADMIN', 'USER')")
    @GetMapping("/getById/{id}")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable String id) {
        return ResponseEntity.ok(invoiceService.getInvoiceById(id));
    }

    // Read (All)
    @PreAuthorize("hasAnyRole('FINANCE', 'ADMIN')")
    @GetMapping("/getAll")
    public ResponseEntity<List<Invoice>> getAllInvoices() {
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }

    // Update
    @PreAuthorize("hasAnyRole('FINANCE', 'ADMIN')")
    @PutMapping("/update/{id}")
    public ResponseEntity<Invoice> updateInvoice(
            @PathVariable String id,
            @RequestBody Invoice updatedInvoice
    ) {
        return ResponseEntity.ok(invoiceService.updateInvoice(id, updatedInvoice));
    }

    // Delete
    @PreAuthorize("hasRole('ADMIN')") // Only ADMIN can delete
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable String id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }
}