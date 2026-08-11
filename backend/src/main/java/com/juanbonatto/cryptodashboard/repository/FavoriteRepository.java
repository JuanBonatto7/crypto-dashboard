package com.juanbonatto.cryptodashboard.repository;

import com.juanbonatto.cryptodashboard.model.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    Optional<Favorite> findByCoinId(String coinId);

    boolean existsByCoinId(String coinId);

    void deleteByCoinId(String coinId);
}
