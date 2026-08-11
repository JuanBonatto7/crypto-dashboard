package com.juanbonatto.cryptodashboard.dto;

import java.time.Instant;

public record FavoriteDto(
        String coinId,
        Instant createdAt
) {
}
