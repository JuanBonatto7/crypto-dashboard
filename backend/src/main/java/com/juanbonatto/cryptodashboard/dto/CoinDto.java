package com.juanbonatto.cryptodashboard.dto;

public record CoinDto(
        String id,
        String symbol,
        String name,
        String image,
        double currentPrice,
        long marketCap,
        int marketCapRank,
        long totalVolume,
        double high24h,
        double low24h,
        Double priceChangePercentage24h
) {
}
