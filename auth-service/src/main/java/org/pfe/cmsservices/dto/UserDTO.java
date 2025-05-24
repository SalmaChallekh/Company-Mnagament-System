package org.pfe.cmsservices.dto;

import lombok.*;
import org.pfe.cmsservices.enums.RoleEnum;

@Data
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String email;
    private String username;
    private RoleEnum role;
    private boolean enabled;
}

