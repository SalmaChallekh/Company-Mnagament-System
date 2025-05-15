package com.pfe.clientVendor_Service.service;

import com.pfe.clientVendor_Service.entity.Client;
import com.pfe.clientVendor_Service.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientService {
    private final ClientRepository clientRepo;
    public Client createClient(Client client) {
        return clientRepo.save(client);
    }
    public List<Client> getAllClients() {
        return clientRepo.findAll();
    }

    public Client getClientById(String id) {
        return clientRepo.findById(id).orElseThrow(() ->
                new RuntimeException("Client not found with id: " + id));
    }

    public Client updateClient(String id, Client updatedClient) {
        Client existing = getClientById(id);

        existing.setFullName(updatedClient.getFullName());
        existing.setPhone(updatedClient.getPhone());
        existing.setEmail(updatedClient.getEmail());
        existing.setCompanyName(updatedClient.getCompanyName());
        existing.setAddress(updatedClient.getAddress());
        existing.setIndustry(updatedClient.getIndustry());

        return clientRepo.save(existing);
    }

    public void deleteClient(String id) {
        if (!clientRepo.existsById(id)) {
            throw new RuntimeException("Client not found with id: " + id);
        }
        clientRepo.deleteById(id);
    }
}
