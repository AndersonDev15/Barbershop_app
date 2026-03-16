package com.barber.project.transaction.service;


import com.barber.project.barber.entity.Barber;
import com.barber.project.reservation.entity.Reservation;
import com.barber.project.transaction.entity.BarberShopIncome;
import com.barber.project.transaction.entity.Transaction;
import com.barber.project.transaction.repository.BarberShopIncomeRepository;

import com.barber.project.transaction.repository.projection.BarberIncomeSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BarberShopIncomeService {
    private final BarberShopIncomeRepository barberShopIncomeRepository;

    @Transactional
    public void createIncome(Transaction transaction) {
        Barber barber = transaction.getBarber();
        Reservation reservation = transaction.getReservation();

        BigDecimal commissionPercentage = barber.getCommission()
                .multiply(BigDecimal.valueOf(100))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal total = transaction.getTotalAmount();
        BigDecimal barberCommission = transaction.getBarberCommission();
        BigDecimal tip = transaction.getTip() != null ? transaction.getTip() : BigDecimal.ZERO;
        BigDecimal barberShopAmount = total.subtract(barberCommission);



        BarberShopIncome income = BarberShopIncome.builder()
                .transactionId(transaction.getId())
                .barbershopId(reservation.getBarber().getBarberShop().getId())
                .barberId(barber.getId())
                .totalAmount(total)
                .barberAmount(barberCommission)
                .barberShopAmount(barberShopAmount)
                .tipAmount(tip)
                .commissionPercentage(commissionPercentage)
                .paymentMethod(transaction.getPaymentMethod())
                .transactionCode(transaction.getTransactionCode())
                .creationDate(transaction.getPaymentDate())
                .transactionDate(transaction.getPaymentDate())
                .note(transaction.getNotes())
                .build();

        barberShopIncomeRepository.save(income);
    }


    @Transactional(readOnly = true)
    public List<BarberShopIncome> findByBarbershopIdAndDateRange(
            Long barbershopId, LocalDate start, LocalDate end) {
        return barberShopIncomeRepository.findByBarbershopIdAndDateRange(barbershopId, start, end);
    }

    @Transactional(readOnly = true)
    public List<BarberShopIncome> findByBarbershopIdAndDate(
            Long barbershopId, LocalDate date) {
        return barberShopIncomeRepository.findByBarbershopIdAndDate(barbershopId, date);
    }

    @Transactional(readOnly = true)
    public List<BarberIncomeSummary> findTopBarberIds(
            Long barbershopId, LocalDate start, LocalDate end, int limit) {
        return barberShopIncomeRepository.findTopBarberIds(barbershopId, start, end, limit);
    }
}