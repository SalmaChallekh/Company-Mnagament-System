package com.pfe.clientVendor_Service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ClientVendorServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClientVendorServiceApplication.class, args);
	}

}
