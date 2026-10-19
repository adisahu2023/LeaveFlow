package com.springboot.leaveflow.controllers;

import com.springboot.leaveflow.dto.AddLeaveDto;
import com.springboot.leaveflow.dto.EmployeeProfileResponse;
import com.springboot.leaveflow.dto.EmployeeResponse;
import com.springboot.leaveflow.dto.LeaveResponseDto;
import com.springboot.leaveflow.entity.Users;
import com.springboot.leaveflow.serives.EmloyeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employee")
public class EmployeeController {
    @Autowired
    private EmloyeeService leaveService;


    @PostMapping
    public ResponseEntity<String> addLeave(@RequestBody AddLeaveDto leaveData,Authentication auth){
        AddLeaveDto savedUser=leaveService.addLeave(leaveData,  auth );
        if(savedUser==null){

            return ResponseEntity.status(505).body("Not created");
        }
        return  ResponseEntity.status(HttpStatus.CREATED).body("User created succesfully");
    }


    @GetMapping("/leaves")
    public ResponseEntity<List<LeaveResponseDto>> getEmployeeLeaves(Authentication auth){
         List<LeaveResponseDto> leaves=leaveService.getLeaves(auth);


             return ResponseEntity.ok(leaves);

    }


    @PutMapping("/leaves/{id}")
    public ResponseEntity<AddLeaveDto> updateLeave(@PathVariable long id ,@RequestBody AddLeaveDto leave,Authentication auth){
         return ResponseEntity.ok(leaveService.updateLeave(id,leave,auth));
    }


    @DeleteMapping("/leave/delete/{id}")
    public ResponseEntity<String> deleteLeave(@PathVariable long id ,Authentication auth){
        leaveService.deleteLeave(id,auth);
        return ResponseEntity.status(HttpStatus.OK).body("Successfully Deleted");
    }

    @GetMapping("/profile")
    public ResponseEntity<EmployeeProfileResponse> getEmployeeById(Authentication auth){
        Users employee = leaveService.getEmployeeById(auth);
        String managerName = employee.getManager() == null ? null : employee.getManager().getName();
        EmployeeProfileResponse profile = new EmployeeProfileResponse(
                managerName,
                employee.getMobile(),
                employee.getName(),
                employee.getRole(),
                employee.getUsername(),
                employee.getActive()
        );
        return ResponseEntity.ok(profile);
    }






}
