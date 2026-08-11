package com.juanbonatto.cryptodashboard.service;

import com.juanbonatto.cryptodashboard.dto.FavoriteDto;
import com.juanbonatto.cryptodashboard.model.entity.Favorite;
import com.juanbonatto.cryptodashboard.repository.FavoriteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;

    public FavoriteService(FavoriteRepository favoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }

    @Transactional(readOnly = true)
    public List<FavoriteDto> getFavorites() {
        return favoriteRepository.findAll().stream()
                .map(favorite -> new FavoriteDto(favorite.getCoinId(), favorite.getCreatedAt()))
                .toList();
    }

    @Transactional
    public FavoriteDto addFavorite(String coinId) {
        Favorite favorite = favoriteRepository.findByCoinId(coinId)
                .orElseGet(() -> favoriteRepository.save(new Favorite(coinId)));
        return new FavoriteDto(favorite.getCoinId(), favorite.getCreatedAt());
    }

    @Transactional
    public void removeFavorite(String coinId) {
        favoriteRepository.deleteByCoinId(coinId);
    }
}
