package com.pfe.finance_service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PayrollScheduler {

    private final PayrollService payrollService;

    // Run at 00:00 on the 1st of every month
   /* @Scheduled(cron = "0 0 0 1 * ?")
    public void generateMonthlyPayrollBatch() {
        payrollService.generatePayrollForAllEmployees();
    }*/
}

