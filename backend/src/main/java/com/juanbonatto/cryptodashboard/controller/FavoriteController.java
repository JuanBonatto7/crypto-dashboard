package com.juanbonatto.cryptodashboard.controller;

import com.juanbonatto.cryptodashboard.dto.FavoriteDto;
import com.juanbonatto.cryptodashboard.service.FavoriteService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public List<FavoriteDto> getFavorites() {
        return favoriteService.getFavorites();
    }

    @PostMapping("/{coinId}")
    @ResponseStatus(HttpStatus.CREATED)
    public FavoriteDto addFavorite(@PathVariable String coinId) {
        return favoriteService.addFavorite(coinId);
    }

    @DeleteMapping("/{coinId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeFavorite(@PathVariable String coinId) {
        favoriteService.removeFavorite(coinId);
    }
}
