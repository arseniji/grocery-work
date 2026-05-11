package com.gitlab.arsenji.bffGrocery.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "session_items")
public class SessionItems {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private WarehouseSessions session;

    @Column(nullable = false)
    private String barcode;

    @Column(name = "rails_product_id")
    private Long railsProductId;

    @Column(name = "product_name")
    private String productName;

    @Column(name = "measurement_unit")
    private String measurementUnit;

    @Column(nullable = false)
    private Integer quantity;
}