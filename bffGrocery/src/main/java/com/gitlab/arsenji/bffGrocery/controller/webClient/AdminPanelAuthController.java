package com.gitlab.arsenji.bffGrocery.controller.webClient;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminPanelAuthController {

    @GetMapping("/login")
    public String showLogin() {
        return "login";
    }
}
