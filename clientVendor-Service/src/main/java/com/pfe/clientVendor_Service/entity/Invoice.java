package com.pfe.clientVendor_Service.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection="invoices")
@AllArgsConstructor
@Getter
@Setter
public class Invoice {
    @Id
    private String id;

    private Date invoiceDate;

    private Date DueDate;

    private Long totalAmount;

    private String status;

    private String items;
    //association with client ( invoice have 1 client and client can have multiple invoices )
}