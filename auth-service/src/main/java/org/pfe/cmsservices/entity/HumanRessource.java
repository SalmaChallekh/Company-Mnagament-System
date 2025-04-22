package org.pfe.cmsservices.entity;
import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "humanRessources")
@Getter
@Setter
@NoArgsConstructor
@PrimaryKeyJoinColumn(name = "user_id")
public class HumanRessource extends User {
}
