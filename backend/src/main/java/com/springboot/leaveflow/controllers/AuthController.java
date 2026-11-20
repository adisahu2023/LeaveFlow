package com.springboot.leaveflow.controllers;

import com.springboot.leaveflow.dto.RegisterDto;
import com.springboot.leaveflow.entity.Login;
import com.springboot.leaveflow.entity.Users;
import com.springboot.leaveflow.serives.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;


    @PostMapping("/login")
    public ResponseEntity<String> Login(@RequestBody Login logindata){
        try{
            String token=authService.login(logindata);
            return ResponseEntity.status(HttpStatus.OK).body(token) ;
        }catch(Exception e){;
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User is not registered");
        }
    }


    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterDto Ruser){
        System.out.println("302");
        Users user=new Users();
        user.setName(Ruser.getName());
        user.setUsername(Ruser.getUsername());
        user.setMobile(Ruser.getMobile());
        user.setPassword(Ruser.getPassword());
        try {
            authService.register(user);

            System.out.println("2. USER REGISTERED SUCCESSFULLY");



        } catch (ResponseStatusException ex) {

            System.out.println("Duplicate user exception: " + ex.getReason());

            return ResponseEntity
                    .status(ex.getStatusCode())
                    .body("user already exist");
        }

        Login logindata=new Login();
        logindata.setUsername(user.getUsername());
        logindata.setPassword(Ruser .getPassword());

        return ResponseEntity.status(HttpStatus.CREATED).body( authService.login(logindata));
    }
}
