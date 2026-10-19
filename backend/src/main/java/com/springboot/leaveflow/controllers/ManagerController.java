package com.springboot.leaveflow.controllers;

import com.springboot.leaveflow.dto.AddCommentDto;
import com.springboot.leaveflow.dto.LeaveResponseDto;
import com.springboot.leaveflow.dto.ManagerProfileResponse;
import com.springboot.leaveflow.dto.UpdateManagerProfileRequest;
import com.springboot.leaveflow.entity.Leaves;
import com.springboot.leaveflow.entity.Status;
import com.springboot.leaveflow.repository.LeaveRepository;
import com.springboot.leaveflow.serives.ManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/manager")
public class ManagerController {
    @Autowired
    private ManagerService managerService;
    @Autowired
    private LeaveRepository leaveRepository;


    @GetMapping("/profile")
    public ResponseEntity<ManagerProfileResponse> getProfile(Authentication auth) {
        return ResponseEntity.ok(managerService.getManagerProfile(auth));
    }


    @PutMapping("/profile")
    public ResponseEntity<ManagerProfileResponse> updateProfile(
            @RequestBody UpdateManagerProfileRequest request, Authentication auth) {
        return ResponseEntity.ok(managerService.updateManagerProfile(request, auth));
    }



    @GetMapping("/leaves")
    public ResponseEntity<List<LeaveResponseDto>> getAllLeaves(@RequestParam(required = false) Status status , Authentication auth){

        List<Leaves> leaves=managerService.getAllLeaves(status,auth);;
        List<LeaveResponseDto> allleaves =
                leaves.stream()
                .map(leave -> {
                    LeaveResponseDto dto = new LeaveResponseDto();

                    dto.setId(leave.getId());
                    dto.setEmployeeName(leave.getUser().getName());
                    dto.setEmployeeUsername(leave.getUser().getUsername());
                    dto.setLeaveType(leave.getLeaveType());
                    dto.setReason(leave.getReason());
                    dto.setStartDate(leave.getStartDate());
                    dto.setEndDate(leave.getEndDate());
                    dto.setStatus(leave.getStatus());
                    dto.setAdminComment(leave.getAdminComment());
                    dto.setCreatedAt(leave.getCreatedAt());
                    dto.setReviewedBy(leave.getReviewedBy());

                    return dto;
                })
                .toList();

        return ResponseEntity.ok(allleaves);

    }


    @PutMapping("/approve/{id}")
    public ResponseEntity<String> approved(@PathVariable long id, @RequestBody AddCommentDto adminComment , Authentication auth){
        System.out.println(id);
        return managerService.approvedStatus(id,adminComment.getAdminComment() ,auth);
    }


    @PutMapping("/reject/{id}")
    public ResponseEntity<String> reject(@PathVariable long id,@RequestBody AddCommentDto adminComment   ,Authentication auth){

        return managerService.rejectedStatus(id,auth,adminComment.getAdminComment());
    }
}
