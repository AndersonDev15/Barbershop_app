package com.barber.project.Scheduler;

import com.barber.project.Repository.PasswordResetTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@EnableScheduling
@RequiredArgsConstructor
public class TokenCleanupScheduler {
    private final PasswordResetTokenRepository tokenRepository;
    @Scheduled(fixedRate = 3600000)
    public void cleanExpiredTokens(){
        tokenRepository.deleteAllExpirationToken(LocalDateTime.now());
    }

}
