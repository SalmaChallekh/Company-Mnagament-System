package com.pfe.clientVendor_Service.controller;

import com.pfe.clientVendor_Service.entity.Client;
import com.pfe.clientVendor_Service.service.ClientService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("api/client")
public class ClientController {
    private ClientService clientService;

    @PreAuthorize("hasAnyRole('FINANCE', 'ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<Client> createClient(@RequestBody Client client) {
        return new ResponseEntity<>(clientService.createClient(client), HttpStatus.CREATED);
    }
    @PreAuthorize("hasAnyRole('FINANCE', 'ADMIN')")
    @GetMapping("/getAll")
    public ResponseEntity<List<Client>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }

    @PreAuthorize("hasAnyRole('FINANCE', 'ADMIN')")
    @GetMapping("/getById/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable String id) {
        return ResponseEntity.ok(clientService.getClientById(id));
    }

    @PreAuthorize("hasAnyRole('FINANCE', 'ADMIN')")
    @PutMapping("/update/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable String id, @RequestBody Client client) {
        return ResponseEntity.ok(clientService.updateClient(id, client));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable String id) {
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }
}
