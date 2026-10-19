package com.springboot.leaveflow.serives;

import com.springboot.leaveflow.dto.AddLeaveDto;
import com.springboot.leaveflow.dto.EmployeeResponse;
import com.springboot.leaveflow.dto.LeaveResponseDto;
import com.springboot.leaveflow.entity.Leaves;
import com.springboot.leaveflow.entity.Status;
import com.springboot.leaveflow.entity.Users;
import com.springboot.leaveflow.repository.LeaveRepository;
import com.springboot.leaveflow.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class EmloyeeService {

    @Autowired
    private LeaveRepository leaveRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    public AddLeaveDto addLeave(AddLeaveDto leaveData, Authentication auth){
        Leaves leave =new Leaves();
       modelMapper.map(leaveData,leave);
       Users user=userRepository.findByUsername(auth.getName()).orElseThrow(()->new UsernameNotFoundException("Invalid user"));
               leave.setUser(user);
        return
                modelMapper.map(leaveRepository.save(leave),AddLeaveDto.class);
    }

    public List<LeaveResponseDto> getLeaves(Authentication auth){
        System.out.println(auth.getName());
        List<LeaveResponseDto>leaves=leaveRepository.getLeavesByUsername(auth.getName());
        return leaves;
    }

    @Transactional
    public AddLeaveDto updateLeave(long id ,AddLeaveDto updateLeave,Authentication auth){
        Leaves leave=leaveRepository.findById(id).orElseThrow(()->new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Leave not found"));

        System.out.println(updateLeave);
        if(updateLeave.getStartDate() == null || updateLeave.getEndDate()==null
                ||updateLeave.getReason()==null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Fields cannot be null");
        }

        // employee can update their only own leave

        if(!leave.getUser().getUsername().equals(auth.getName())){
           throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "You can update only own leave");
        }

        if( !leave.getStatus().equals(Status.PENDING)){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only PENDING leave can be updated. Current status: "
                            + leave.getStatus());
        }

        if (updateLeave.getEndDate().isBefore(updateLeave.getStartDate())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "End date cannot be before start date");
        }
        if (updateLeave.getStartDate().isBefore(LocalDate.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Start date cannot be in the past");
        }

        leave.setStartDate(updateLeave.getStartDate());
        leave.setEndDate(updateLeave.getEndDate());
        leave.setReason(updateLeave.getReason());



        return modelMapper.map( leaveRepository.save(leave),AddLeaveDto.class);
    }

    @Transactional
    public void deleteLeave(long id,Authentication auth){
        Leaves leave =leaveRepository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Leave is not exist"));
        if( !leave.getUser().getUsername().equals(auth.getName())){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"you can update othres leave");
        }
        if(!leave.getStatus().equals(Status.PENDING)){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"You can delete only pending request");
        }
        leaveRepository.delete(leave);

    }

    public Users getEmployeeById(Authentication auth){
        Users user=userRepository.findByUsername(auth.getName()).orElseThrow(()->new ResponseStatusException(HttpStatus.BAD_REQUEST,"User does not found"));
                return user;

    }



}
