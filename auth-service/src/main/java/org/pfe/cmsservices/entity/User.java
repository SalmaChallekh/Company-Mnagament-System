package org.pfe.cmsservices.entity;

import jakarta.persistence.*;
import lombok.*;
import org.pfe.cmsservices.enums.RoleEnum;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoleEnum role;

   /* @Column(name = "department_id")
    private Long departmentId;*/

    @Column(nullable = false)
    private boolean enabled = true;

    @Column
    private String verificationToken;
}
