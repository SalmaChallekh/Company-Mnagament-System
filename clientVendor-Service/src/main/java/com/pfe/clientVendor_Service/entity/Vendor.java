package com.pfe.clientVendor_Service.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "vendors")
@AllArgsConstructor
@Getter
@Setter
public class Vendor {
    @Id
    private String id;
    private String name;
    private String email;
    private Long phone;
    private String address;
    private String category;
}
