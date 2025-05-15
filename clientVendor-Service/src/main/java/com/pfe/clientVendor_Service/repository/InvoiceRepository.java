package com.pfe.clientVendor_Service.repository;

import com.pfe.clientVendor_Service.entity.Invoice;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface InvoiceRepository extends MongoRepository<Invoice,String> {
}