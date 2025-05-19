package org.pfe.cmsservices.entity;

import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "employees")
@Getter
@Setter
@NoArgsConstructor
@PrimaryKeyJoinColumn(name = "user_id")
public class Employee  extends User{
}