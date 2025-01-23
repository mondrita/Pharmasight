package com.pharmasight.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;


@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "username cannot be empty")
    @NonNull
    @Column(unique=true)
    private String username;

    @NotBlank(message = "password cannot be empty")
    @NonNull
    private String password;

}
