package com.pfe.clientVendor_Service.repository;

import com.pfe.clientVendor_Service.entity.Client;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ClientRepository extends MongoRepository<Client, String> {
}
