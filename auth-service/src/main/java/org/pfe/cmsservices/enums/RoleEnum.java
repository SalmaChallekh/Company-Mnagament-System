package org.pfe.cmsservices.enums;

public enum RoleEnum {
    ROLE_USER,
    ROLE_ADMIN,
    ROLE_HR,
    ROLE_MANAGER,
    ROLE_EMPLOYEE,
    ROLE_FINANCE;
    public String getAuthority() {
        return this.name();
    }
}
