package com.pfe.clientVendor_Service.dto;

import lombok.*;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class invoiceDTO {
    private Long id;
    private Date invoiceDate;
    private Date DueDate;
    private Long totalAmount;
    private String status;
    private String items;
}
