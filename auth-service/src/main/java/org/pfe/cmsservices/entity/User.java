package org.pfe.cmsservices.entity;

import jakarta.persistence.*;
import lombok.*;
import org.pfe.cmsservices.enums.RoleEnum;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true, unique = true)
    private String username;

    //@Column(nullable = false)
    @Column(nullable = true)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private RoleEnum role;

    @Column(name = "department_id")
    private Long departmentId;

    @Column(nullable = false)
    private boolean enabled = true;

    @Column
    private String verificationToken;
    @Column(name = "token_expiry")
    @Builder.Default
    private LocalDateTime tokenExpiry = LocalDateTime.now().plusDays(2);
}
