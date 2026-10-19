package com.springboot.leaveflow.controllers;

import com.springboot.leaveflow.dto.RegisterDto;
import com.springboot.leaveflow.entity.Login;
import com.springboot.leaveflow.entity.Users;
import com.springboot.leaveflow.serives.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @CrossOrigin("http://localhost:5173")
    @PostMapping("/login")
    public ResponseEntity<String> Login(@RequestBody Login logindata){

        return ResponseEntity.status(HttpStatus.OK).body(authService.login(logindata)) ;
    }


    @PostMapping("/register")
    @CrossOrigin("http://localhost:5173")
    public ResponseEntity<String> register(@RequestBody RegisterDto Ruser){
        Users user=new Users();
        user.setName(Ruser.getName());
        user.setUsername(Ruser.getUsername());
        user.setMobile(Ruser.getMobile());
        user.setPassword(Ruser.getPassword());
        authService.register(user);
        return ResponseEntity.status(HttpStatus.CREATED).body("Created succesfully");
    }
}
