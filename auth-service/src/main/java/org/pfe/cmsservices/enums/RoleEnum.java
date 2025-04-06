package org.pfe.cmsservices.enums;

public enum RoleEnum {
    ROLE_USER, ROLE_ADMIN;
    public String getAuthority() {
        return this.name(); // Returns the role name when needed (e.g., ROLE_USER)
    }

}
