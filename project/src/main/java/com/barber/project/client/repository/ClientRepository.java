package com.barber.project.client.repository;

import com.barber.project.client.entity.Client;
import com.barber.project.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByUser(User user);
   // Optional<Client> findByUserEmail(String email);
    Optional<Client> findByUser_UserUuid(String userUuid);


}
