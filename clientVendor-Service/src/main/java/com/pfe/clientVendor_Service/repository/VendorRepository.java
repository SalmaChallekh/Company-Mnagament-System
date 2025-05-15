package com.pfe.clientVendor_Service.repository;

import com.pfe.clientVendor_Service.entity.Vendor;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface VendorRepository extends MongoRepository<Vendor, String> {
}
