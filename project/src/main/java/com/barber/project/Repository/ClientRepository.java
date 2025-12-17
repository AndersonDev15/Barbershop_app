package com.barber.project.Repository;

import com.barber.project.Entity.BarberShop;
import com.barber.project.Entity.Client;
import com.barber.project.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByUser(User user);
    Optional<Client> findByUserEmail(String email);
}
