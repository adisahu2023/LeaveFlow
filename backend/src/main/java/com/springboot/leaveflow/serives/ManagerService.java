package com.springboot.leaveflow.serives;

import com.springboot.leaveflow.dto.LeaveResponseDto;
import com.springboot.leaveflow.dto.ManagerProfileResponse;
import com.springboot.leaveflow.dto.UpdateManagerProfileRequest;
import com.springboot.leaveflow.entity.Leaves;
import com.springboot.leaveflow.entity.Status;
import com.springboot.leaveflow.entity.Users;
import com.springboot.leaveflow.repository.LeaveRepository;
import com.springboot.leaveflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.List;

@Service
@RequestMapping("/manager")
public class ManagerService {
    @Autowired
    private LeaveRepository leaveRepository;
    @Autowired
    private UserRepository userRepository;



    public List<Leaves> getAllLeaves(Status status ,Authentication auth){
        Users manager = userRepository.findByUsername(auth.getName()).orElseThrow(() -> new RuntimeException("User not found"));
        if(status==null) {
            return leaveRepository.findByUser_Manager_Id(manager.getId());
        }else{
            return leaveRepository.findAllByStatus(status,manager.getId());
        }
    }


    public ResponseEntity<String> approvedStatus(long id, String adminComment , Authentication auth){
        Users manager=userRepository.findByUsername(auth.getName()).orElseThrow(()->new RuntimeException("Manager not found"));
        Leaves leave=leaveRepository.findById(id).orElseThrow(()->new RuntimeException("Leave does not exists"));
        if(leave.getStatus()== Status.APPROVED){
            return   ResponseEntity.badRequest().body("Already Approved");
        }
        if(leave.getStatus()== Status.REJECTED){
            return   ResponseEntity.badRequest().body("YOU CANT APPROVED ONCE REJECTED");
        }
        if(leave.getUser().getManager() == null || !leave.getUser().getManager().getId().equals(manager.getId())){
           return ResponseEntity.badRequest().body("Given leave is not associated with Manager"+manager.getUsername());
        }

        leaveRepository.approvedStatus(id,manager.getUsername(),adminComment);
        return ResponseEntity.ok().body("Approved Successfully");
    }
    public ResponseEntity<String> rejectedStatus(long id, Authentication auth,String adminComment ){
        Users manager=userRepository.findByUsername(auth.getName()).orElseThrow(()->new RuntimeException("Manager not found"));
        Leaves leave=leaveRepository.findById(id).orElseThrow(()->new RuntimeException("Leave does not exists"));
        if(leave.getStatus()== Status.REJECTED){
            return   ResponseEntity.badRequest().body("Already REJECTED");
        }
        if(leave.getStatus()== Status.APPROVED){
            return   ResponseEntity.badRequest().body("YOU CANT REJECTED ONCE APPROVED");
        }
        if(leave.getUser().getManager() == null || !leave.getUser().getManager().getId().equals(manager.getId())){
            return ResponseEntity.badRequest().body("Given leave is not associated with Manager"+manager.getUsername());
        }
        leaveRepository.rejectedStatus(id,manager.getUsername(), adminComment );
        return ResponseEntity.ok().body("REJECTED Successfully");
    }

    public ManagerProfileResponse getManagerProfile(Authentication auth) {
        Users manager = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Manager not found"));
        return toProfileResponse(manager);
    }

    @Transactional
    public ManagerProfileResponse updateManagerProfile(UpdateManagerProfileRequest request, Authentication auth) {
        Users manager = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Manager not found"));
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }
        manager.setName(request.getName().trim());
        manager.setMobile(request.getMobile());
        return toProfileResponse(manager);
    }

    private ManagerProfileResponse toProfileResponse(Users manager) {
        return new ManagerProfileResponse(manager.getName(), manager.getUsername(), manager.getMobile(), manager.getRole());
    }
}
