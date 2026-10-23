package com.springboot.leaveflow.serives;

import com.springboot.leaveflow.dto.AddUsersDto;
import com.springboot.leaveflow.dto.AdminUserResponse;
import com.springboot.leaveflow.dto.AdminProfileResponse;
import com.springboot.leaveflow.dto.LeaveResponseDto;
import com.springboot.leaveflow.dto.UpdateAdminProfileRequest;
import com.springboot.leaveflow.entity.*;
import com.springboot.leaveflow.repository.LeaveRepository;
import com.springboot.leaveflow.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Set;


@Service
public class AdminService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private LeaveRepository leaveRepository;


    @Transactional
    public String addUser(AddUsersDto addUser) {

        if (userRepository.existsByUsername(addUser.getUsername())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Username already registered"
            );
        }
        Users user = new Users();
        modelMapper.map(addUser, user);
        user.setPassword(passwordEncoder.encode(addUser.getPassword()));
        if (user.getActive() == null) user.setActive(Active.ACTIVE);
        userRepository.save(user);

        return "User created successfully";
    }

    @Transactional
    public void assignManager(Long employeeId, Long managerId) {

        Users employee = userRepository.findById(employeeId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND, "Employee not found"));

        Users manager = userRepository.findById(managerId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND, "Manager not found"));

        if (employee.getRole() != UserRole.EMPLOYEE) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Selected user is not an employee");
        }

        if (manager.getRole() != UserRole.MANAGER) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Selected user is not a manager");
        }
        if(employee.getManager()!=null ){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Selected user have already manager");
        }

        employee.setManager(manager);
        userRepository.save(employee);
    }

    @Transactional
    public void assignRole(Long userId, UserRole role) {

        Users user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND, "User not found"));


        user.setRole(role);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<AdminUserResponse> getAllUsers(){
        return userRepository.findAll().stream().map(user -> new AdminUserResponse(
                user.getId(), user.getUsername(), user.getName(), user.getMobile(), user.getRole(),
                user.getActive(), user.getManager() == null ? null : user.getManager().getId(),
                user.getManager() == null ? null : user.getManager().getName()
        )).toList();
    }

    @Transactional
    public void setActive(Active active,long id){
       Users user= userRepository.findById(id).orElseThrow(()-> new ResponseStatusException(HttpStatus.BAD_REQUEST,"User not found"));
       user.setActive(active);
       userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<LeaveResponseDto> getLeaves(Status status){
        List<Leaves> leaves = status == null ? leaveRepository.findAll() : leaveRepository.findAllByStatus(status);
        return leaves.stream().map(leave -> new LeaveResponseDto(
                leave.getId(), leave.getUser().getName(), leave.getUser().getUsername(),
                leave.getLeaveType(), leave.getReason(), leave.getStartDate(), leave.getEndDate(),
                leave.getStatus(), leave.getAdminComment(), leave.getCreatedAt(), leave.getReviewedBy()
        )).toList();
    }

    public AdminProfileResponse getAdminProfile(Authentication auth) {
        Users admin = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin not found"));
        return toProfileResponse(admin);
    }

    @Transactional
    public AdminProfileResponse updateAdminProfile(UpdateAdminProfileRequest request, Authentication auth) {
        Users admin = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin not found"));
        if (request.getName() == null || request.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required");
        }
        admin.setName(request.getName().trim());
        admin.setMobile(request.getMobile());
        return toProfileResponse(admin);
    }

    private AdminProfileResponse toProfileResponse(Users user) {
        return new AdminProfileResponse(user.getName(), user.getUsername(), user.getMobile(), user.getRole());
    }

    @Transactional
    public void setEmployeePassword(String username,String password){
        Users user=userRepository.findByUsername(username).orElseThrow(()->new ResponseStatusException(HttpStatus.BAD_REQUEST,"Employee does not found"));

        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);

    }


}
