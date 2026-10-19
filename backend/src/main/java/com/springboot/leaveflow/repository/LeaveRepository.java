package com.springboot.leaveflow.repository;

import com.springboot.leaveflow.dto.AddCommentDto;
import com.springboot.leaveflow.dto.EmployeeResponse;
import com.springboot.leaveflow.dto.LeaveResponseDto;
import com.springboot.leaveflow.entity.Leaves;
import com.springboot.leaveflow.entity.Status;
import jakarta.transaction.Transactional;
import org.apache.catalina.Manager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LeaveRepository extends JpaRepository<Leaves,Long> {


    @Query("""

            select new com.springboot.leaveflow.dto.LeaveResponseDto(
            l.id, l.startDate, l.endDate, l.reason,
            l.status, l.adminComment,l.leaveType, l.createdAt,
            l.reviewedBy)
        from Leaves l
        where l.user.username = :username
        order by l.createdAt desc
        """)
    List<LeaveResponseDto> getLeavesByUsername(@Param("username") String username);

    List<Leaves> findByUser_Manager_Id(long managerId);




    @Modifying
    @Query("""
      update Leaves set status='APPROVED' ,reviewedBy=:managerUsername,adminComment=:adminComment where id=:id
""")
    @Transactional
    public void  approvedStatus(@Param("id") long id, @Param("managerUsername") String managerUsername, @Param("adminComment") String adminComment);

    @Modifying
    @Query("""
      update Leaves set status='REJECTED',reviewedBy=:managerUsername,adminComment=:adminComment where id=:id
""")
    @Transactional
    public void  rejectedStatus(@Param("id") long id, @Param("managerUsername") String managerUsername, @Param("adminComment") String adminComment);


    @Query("""
    FROM Leaves l
    WHERE l.user.manager.id = :id
      AND l.status = :status
""")
    List<Leaves> findAllByStatus(@Param("status") Status status, @Param("id") long id);

    @Query("""
    FROM Leaves l
    WHERE  l.status = :status
""")
    List<Leaves> findAllByStatus(@Param("status") Status status);

}
