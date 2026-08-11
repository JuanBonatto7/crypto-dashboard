package com.juanbonatto.cryptodashboard.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.Instant;

@Entity
@Table(name = "favorites", uniqueConstraints = @UniqueConstraint(columnNames = "coin_id"))
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "coin_id", nullable = false)
    private String coinId;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected Favorite() {
        // required by JPA
    }

    public Favorite(String coinId) {
        this.coinId = coinId;
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getCoinId() {
        return coinId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
