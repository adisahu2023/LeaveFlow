package com.springboot.leaveflow.serives;

import com.springboot.leaveflow.entity.Login;
import com.springboot.leaveflow.entity.Users;
import com.springboot.leaveflow.repository.UserRepository;
import com.springboot.leaveflow.serives.jwtservices.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserRepository userRepository;
    private AuthenticationManager authenticationManager;
    private JwtService jwtService;

    public AuthService(
            AuthenticationManager authenticationManager,
            JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }


    public Users register(Users user){
        userRepository.findByUsername(user.getUsername())
                .ifPresent(existingUser -> {
                    throw new ResponseStatusException(
                            HttpStatusCode.valueOf(409),
                            "User Already Registered"
                    );
                });
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        System.out.println(user.getPassword());
        return userRepository.save(user);
    }

    public String login(Login login){
        System.out.println("Login service entered");
        System.out.println(
                passwordEncoder.encode("Admin@123")
        );
       Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        login.getUsername(),
                        login.getPassword()
                )
        );
        System.out.println("Authentication successful");
        String role = authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority();

        return jwtService.generateToken(authentication.getName(),role);
    }

}
