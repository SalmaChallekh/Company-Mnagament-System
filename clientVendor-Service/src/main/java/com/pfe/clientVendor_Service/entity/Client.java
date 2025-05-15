package com.pfe.clientVendor_Service.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "clients")
@AllArgsConstructor
@Getter
@Setter
public class Client {
    @Id
    private String id ;
    private String fullName;
    private Long phone;
    private String email;
    private String companyName;
    private String address;
    private String industry;

}
