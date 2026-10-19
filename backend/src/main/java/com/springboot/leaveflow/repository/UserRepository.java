package com.springboot.leaveflow.repository;

import com.springboot.leaveflow.entity.Active;
import com.springboot.leaveflow.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users,Long> {


    Optional<Users> findByUsername(String username);

    boolean existsByUsername(String username);




}
