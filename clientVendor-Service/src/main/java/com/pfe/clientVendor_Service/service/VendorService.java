package com.pfe.clientVendor_Service.service;


import com.pfe.clientVendor_Service.entity.Vendor;

import com.pfe.clientVendor_Service.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class VendorService {
    private final VendorRepository vendorRepo;
    public Vendor createVendor(Vendor vendor) {
        return vendorRepo.save(vendor);
    }
    public List<Vendor> getAllVendors() {
        return vendorRepo.findAll();
    }

    public Vendor getVendorById(String id) {
        return vendorRepo.findById(id).orElseThrow(() ->
                new RuntimeException("Vendor not found with id: " + id));
    }

    public Vendor updateVendor(String id, Vendor updatedVendor) {
        Vendor existing = getVendorById(id);

        existing.setName(updatedVendor.getName());
        existing.setPhone(updatedVendor.getPhone());
        existing.setEmail(updatedVendor.getEmail());
        existing.setAddress(updatedVendor.getAddress());
        existing.setCategory(updatedVendor.getCategory());

        return vendorRepo.save(existing);
    }

    public void deleteVendor(String id) {
        if (!vendorRepo.existsById(id)) {
            throw new RuntimeException("Vendor not found with id: " + id);
        }
        vendorRepo.deleteById(id);
    }
}