package com.pharmasight.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Division {

    @Id
    private Long id;

    @Column(name="name")
    @NotNull
    private String name;

    @NotNull
    private float latitude;

    @NotNull
    private float longitude;

    @Column(name="zoom_val")
    private Double zoomVal;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String geoData;
}

