package com.auth.server.Security;

import com.auth.server.Entity.AuthIdentity;
import com.auth.server.Repository.AuthIdentityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthUserDetailsService implements UserDetailsService {

    private final AuthIdentityRepository authIdentityRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        String normalizedEmail = email.trim().toLowerCase();
        AuthIdentity authIdentity = authIdentityRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Email no encontrado: " + normalizedEmail));

        return User.builder()
                .username(authIdentity.getEmail())
                .password(authIdentity.getPassword())
                .disabled(!authIdentity.isEnabled() || !authIdentity.isEmailVerified())
                .authorities(authIdentity.getRoles().stream()
                        .map(authRole -> new SimpleGrantedAuthority("ROLE_" + authRole.getName()))
                        .toList())
                .build();
    }



}
