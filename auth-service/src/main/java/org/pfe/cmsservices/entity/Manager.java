package org.pfe.cmsservices.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "managers")
@Getter
@Setter
@NoArgsConstructor
@PrimaryKeyJoinColumn(name = "user_id")
public class Manager extends User {

    /*public Manager(User user) {
        this.setId(user.getId());
        this.setUsername(user.getUsername());
        this.setPassword(user.getPassword());
        this.setEmail(user.getEmail());
        this.setRole(user.getRole());
        this.setDepartmentId(user.getDepartmentId());
        this.setEnabled(user.isEnabled());
        this.setVerificationToken(user.getVerificationToken());
        this.setTokenExpiry(user.getTokenExpiry());
    }*/
}