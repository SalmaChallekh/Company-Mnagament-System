package org.pfe.cmsservices.repository;

import org.pfe.cmsservices.entity.User;
import org.pfe.cmsservices.enums.RoleEnum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;
public interface UserRepository extends JpaRepository<User, Long> {
    //find user by username
    Optional<User> findByUsername(String username);
    // Check if a username exists
    boolean existsByUsername(String username);

    List<User> findByDepartmentId(Long departmentId);
    // Check if an email exists
    boolean existsByEmail(String email);
    Optional<User> findByVerificationToken(String token);
    Optional<User> findByEmail(String email);
    List<User> findByRole(RoleEnum role);

}
