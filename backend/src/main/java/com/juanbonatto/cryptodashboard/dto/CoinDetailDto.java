package com.juanbonatto.cryptodashboard.dto;

public record CoinDetailDto(
        String id,
        String symbol,
        String name,
        String description,
        String image,
        int marketCapRank,
        double currentPrice,
        long marketCap,
        long totalVolume,
        double high24h,
        double low24h,
        Double priceChangePercentage24h,
        Double priceChangePercentage7d,
        double ath,
        double athChangePercentage,
        double circulatingSupply,
        String homepage
) {
}
