package com.pfe.clientVendor_Service.controller;

import com.pfe.clientVendor_Service.entity.Vendor;
import com.pfe.clientVendor_Service.service.VendorService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("api/vendor")
public class VendorController {
    private VendorService vendorService;

    @PreAuthorize("hasAnyRole('FINANCE', 'ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<Vendor> createVendor(@RequestBody Vendor vendor) {
        return new ResponseEntity<>(vendorService.createVendor(vendor), HttpStatus.CREATED);
    }
    @PreAuthorize("hasAnyRole('FINANCE', 'ADMIN')")
    @GetMapping("/getAll")
    public ResponseEntity<List<Vendor>> getAllVendors() {
        return ResponseEntity.ok(vendorService.getAllVendors());
    }

    @PreAuthorize("hasAnyRole('FINANCE', 'ADMIN')")
    @GetMapping("/getById/{id}")
    public ResponseEntity<Vendor> getVendorById(@PathVariable String id) {
        return ResponseEntity.ok(vendorService.getVendorById(id));
    }

    @PreAuthorize("hasAnyRole('FINANCE', 'ADMIN')")
    @PutMapping("/update/{id}")
    public ResponseEntity<Vendor> updateVendor(@PathVariable String id, @RequestBody Vendor vendor) {
        return ResponseEntity.ok(vendorService.updateVendor(id, vendor));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteVendor(@PathVariable String id) {
        vendorService.deleteVendor(id);
        return ResponseEntity.noContent().build();
    }
}