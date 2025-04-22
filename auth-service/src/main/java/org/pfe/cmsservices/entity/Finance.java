package org.pfe.cmsservices.entity;
import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "financeteam")
@Getter
@Setter
@NoArgsConstructor
@PrimaryKeyJoinColumn(name = "user_id")
public class Finance extends User {
}
