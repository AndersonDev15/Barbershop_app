package com.auth.server.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller  // ⭐ NO usar @RestController
public class LoginController {

    @GetMapping("/login")
    public String login() {
        return "login";  // Busca login.html en resources/templates/
    }
}