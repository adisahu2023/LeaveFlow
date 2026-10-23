package com.springboot.leaveflow.config;

import com.springboot.leaveflow.entity.Active;
import com.springboot.leaveflow.entity.UserRole;
import com.springboot.leaveflow.entity.Users;
import com.springboot.leaveflow.repository.UserRepository;
import com.springboot.leaveflow.serives.jwtservices.JwtService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuthSuccessHandler
        implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public OAuthSuccessHandler(
            UserRepository userRepository,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oauthUser =
                (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");

        if (email == null || email.isBlank()) {
            response.sendError(401, "GitHub email is unavailable.");
            return;
        }

        Users user = userRepository.findByUsername(email)
                .orElseGet(() -> {
                    Users newUser = new Users();

                    newUser.setUsername(email);
                    newUser.setName(name);
                    newUser.setRole(UserRole.EMPLOYEE);
                    newUser.setActive(Active.ACTIVE);



                    return userRepository.save(newUser);
                });

        if (user == null) {
            response.sendError(
                    401, "No matching LeaveFlow account found.");
            return;
        }

        if (user.getActive() != Active.ACTIVE) {
            response.sendError(403, "Account is inactive.");
            return;
        }

        String token = jwtService.generateToken(
                user.getUsername(),
                "ROLE_" + user.getRole().name()
        );
        System.out.println(token);

        response.sendRedirect(
                "https://leavwf.netlify.app/oauth-success#token=" + token
        );
    }
}
