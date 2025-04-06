package org.pfe.cmsservices.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.pfe.cmsservices.enums.RoleEnum;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminCreateUserRequest {
    private String username;
    private String email;
    private RoleEnum role;
    private String department;
}
