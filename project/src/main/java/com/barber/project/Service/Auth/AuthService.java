package com.barber.project.Service.Auth;

import com.barber.project.Dto.Request.BarberShop.BarberShopRequest;
import com.barber.project.Dto.Request.Authentication.LoginRequest;
import com.barber.project.Dto.Request.Authentication.RegisterRequest;
import com.barber.project.Entity.BarberShop;
import com.barber.project.Entity.Client;
import com.barber.project.Entity.User;
import com.barber.project.Dto.Response.Auth.tokenResponse;
import com.barber.project.Exception.BadCredentialsException;
import com.barber.project.Exception.DuplicateResourceException;
import com.barber.project.Exception.ResourceNotFoundException;
import com.barber.project.Repository.BarberShopRepository;
import com.barber.project.Repository.ClientRepository;
import com.barber.project.Repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final ClientRepository clientRepository;
    private final BarberShopRepository barberShopRepository;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, ClientRepository clientRepository, BarberShopRepository barberShopRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.clientRepository = clientRepository;
        this.barberShopRepository = barberShopRepository;
    }

    @Value("${jwt.secret}")
    private String JwtSecret;

    @Transactional
    public String register (RegisterRequest request){
        if(userRepository.existsByEmail(request.getEmail())){
            throw new DuplicateResourceException("Ya existe ese correo");
        }
        if(userRepository.existsByPhone(request.getPhone())){
            throw new DuplicateResourceException("Ya un usuario tiene ese numero de telefono");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setUserType(request.getUserType());
        user.setRegistrationDate(LocalDateTime.now());

        User savedUser = userRepository.save(user);

       //crear el tipo de usuario
        createEntityByUserType(savedUser,request);


        return "Usuario registrado exitosamente como " + request.getUserType();

    }


    public tokenResponse login(LoginRequest request){
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        if(!authentication.isAuthenticated()){
            throw new BadCredentialsException("Credenciales Invalidas");
        }
        return tokenResponse.builder()
                .token( generarToken(request.getEmail()))
                .build();


    }

    private void createEntityByUserType(User user,RegisterRequest request){
        switch (request.getUserType()){
            case CLIENTE -> {
                Client client = new Client();
                client.setUser(user);
                client.setPreferences("Ninguna");
                client.setLastVisitDate(LocalDateTime.now());
                clientRepository.save(client);
            }
            case BARBERIA -> {
                BarberShopRequest barberShopRequest = request.getBarberShop();
                if(barberShopRequest == null){
                    throw new IllegalArgumentException("Los datos de la berberia son requeridos");
                }
                BarberShop shop = new BarberShop();
                shop.setName(barberShopRequest.getName());
                shop.setAddress(barberShopRequest.getAddress());
                shop.setPhone(barberShopRequest.getPhone());
                shop.setUser(user);
                barberShopRepository.save(shop);

            }
        }
    }

    public String generarToken(String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new ResourceNotFoundException("Email no encontrado"));

        // Asegurar que lastPasswordChange no sea null
        if (user.getLastPasswordChange() == null) {
            user.setLastPasswordChange(LocalDateTime.now());
            userRepository.save(user);
        }
        LocalDateTime passwordChanged = user.getLastPasswordChange()
                .truncatedTo(ChronoUnit.SECONDS);

        Key key = Keys.hmacShaKeyFor(
                JwtSecret.getBytes(StandardCharsets.UTF_8)
        );
        return Jwts.builder()
                .setSubject(email)
                .claim("roles", List.of(user.getUserType().name()))
                .claim(
                        "passwordChangedAt",
                        passwordChanged
                                .atZone(ZoneOffset.UTC)
                                .toInstant()
                                .getEpochSecond()
                )
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

    }
}
