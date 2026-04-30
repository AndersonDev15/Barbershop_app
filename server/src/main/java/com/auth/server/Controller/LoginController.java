package com.auth.server.Controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginController {

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @GetMapping("/login")
    public String login(Model model) {
        model.addAttribute("frontendUrl", frontendUrl);
        return "login";
    }
}