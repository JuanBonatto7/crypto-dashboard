package com.juanbonatto.cryptodashboard.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.juanbonatto.cryptodashboard.dto.CoinDetailDto;
import com.juanbonatto.cryptodashboard.dto.CoinDto;
import com.juanbonatto.cryptodashboard.dto.MarketChartPointDto;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Proxies the public CoinGecko API and maps its responses to our own DTOs,
 * so the frontend never talks to CoinGecko directly. Results are cached
 * briefly in memory to stay within CoinGecko's free-tier rate limits.
 */
@Service
public class CoinService {

    private static final Duration MARKETS_TTL = Duration.ofSeconds(60);
    private static final Duration DETAIL_TTL = Duration.ofSeconds(120);
    private static final Duration CHART_TTL = Duration.ofMinutes(5);

    private final RestClient coinGeckoRestClient;

    private volatile CacheEntry<List<CoinDto>> marketsCache;
    private final Map<String, CacheEntry<List<CoinDto>>> marketsByIdsCache = new ConcurrentHashMap<>();
    private final Map<String, CacheEntry<CoinDetailDto>> detailCache = new ConcurrentHashMap<>();
    private final Map<String, CacheEntry<List<MarketChartPointDto>>> chartCache = new ConcurrentHashMap<>();

    public CoinService(RestClient coinGeckoRestClient) {
        this.coinGeckoRestClient = coinGeckoRestClient;
    }

    public List<CoinDto> getMarkets() {
        CacheEntry<List<CoinDto>> cached = marketsCache;
        if (cached != null && cached.isValid()) {
            return cached.value();
        }

        List<CoinDto> mapped = fetchMarkets(
                "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h"
        );
        marketsCache = new CacheEntry<>(mapped, Instant.now().plus(MARKETS_TTL));
        return mapped;
    }

    public List<CoinDto> getMarketsByIds(List<String> ids) {
        if (ids.isEmpty()) {
            return List.of();
        }

        String cacheKey = String.join(",", ids);
        CacheEntry<List<CoinDto>> cached = marketsByIdsCache.get(cacheKey);
        if (cached != null && cached.isValid()) {
            return cached.value();
        }

        List<CoinDto> mapped = fetchMarkets(
                "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h&ids="
                        + cacheKey
        );
        marketsByIdsCache.put(cacheKey, new CacheEntry<>(mapped, Instant.now().plus(MARKETS_TTL)));
        return mapped;
    }

    private List<CoinDto> fetchMarkets(String uri) {
        List<CoinGeckoMarketItem> raw = fetch(uri, new ParameterizedTypeReference<>() {});
        return raw == null ? List.of() : raw.stream().map(this::toDto).toList();
    }

    public CoinDetailDto getCoinDetail(String id) {
        CacheEntry<CoinDetailDto> cached = detailCache.get(id);
        if (cached != null && cached.isValid()) {
            return cached.value();
        }

        CoinGeckoDetailResponse raw = fetch(
                "/coins/%s?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false"
                        .formatted(id),
                new ParameterizedTypeReference<>() {}
        );

        CoinDetailDto mapped = toDetailDto(raw);
        detailCache.put(id, new CacheEntry<>(mapped, Instant.now().plus(DETAIL_TTL)));
        return mapped;
    }

    public List<MarketChartPointDto> getMarketChart(String id, int days) {
        String cacheKey = id + ":" + days;
        CacheEntry<List<MarketChartPointDto>> cached = chartCache.get(cacheKey);
        if (cached != null && cached.isValid()) {
            return cached.value();
        }

        CoinGeckoChartResponse raw = fetch(
                "/coins/%s/market_chart?vs_currency=usd&days=%d".formatted(id, days),
                new ParameterizedTypeReference<>() {}
        );

        List<MarketChartPointDto> mapped = toChartPoints(raw);
        chartCache.put(cacheKey, new CacheEntry<>(mapped, Instant.now().plus(CHART_TTL)));
        return mapped;
    }

    private <T> T fetch(String uri, ParameterizedTypeReference<T> type) {
        try {
            return coinGeckoRestClient.get().uri(uri).retrieve().body(type);
        } catch (RestClientResponseException ex) {
            if (ex.getStatusCode().value() == 429) {
                throw new CoinGeckoUnavailableException(
                        "CoinGecko rate limit exceeded, try again in a few seconds.", ex);
            }
            throw new CoinGeckoUnavailableException(
                    "CoinGecko request failed with status " + ex.getStatusCode(), ex);
        } catch (RestClientException ex) {
            throw new CoinGeckoUnavailableException("Could not reach CoinGecko.", ex);
        }
    }

    private CoinDto toDto(CoinGeckoMarketItem item) {
        return new CoinDto(
                item.id(),
                item.symbol(),
                item.name(),
                item.image(),
                item.currentPrice(),
                item.marketCap(),
                item.marketCapRank() == null ? 0 : item.marketCapRank(),
                item.totalVolume(),
                item.high24h() == null ? 0 : item.high24h(),
                item.low24h() == null ? 0 : item.low24h(),
                item.priceChangePercentage24h()
        );
    }

    private CoinDetailDto toDetailDto(CoinGeckoDetailResponse response) {
        CoinGeckoMarketData market = response.marketData();
        String homepage = response.links() != null
                && response.links().homepage() != null
                && !response.links().homepage().isEmpty()
                ? response.links().homepage().get(0)
                : "";

        return new CoinDetailDto(
                response.id(),
                response.symbol(),
                response.name(),
                response.description() != null ? response.description().en() : "",
                response.image() != null ? response.image().large() : "",
                response.marketCapRank() == null ? 0 : response.marketCapRank(),
                market.currentPrice().usd(),
                (long) market.marketCap().usd(),
                (long) market.totalVolume().usd(),
                market.high24h().usd(),
                market.low24h().usd(),
                market.priceChangePercentage24h(),
                market.priceChangePercentage7d(),
                market.ath().usd(),
                market.athChangePercentage().usd(),
                market.circulatingSupply(),
                homepage
        );
    }

    private List<MarketChartPointDto> toChartPoints(CoinGeckoChartResponse response) {
        if (response == null || response.prices() == null) {
            return List.of();
        }
        return response.prices().stream()
                .filter(point -> point.size() == 2)
                .map(point -> new MarketChartPointDto(point.get(0).longValue(), point.get(1)))
                .toList();
    }

    private record CacheEntry<T>(T value, Instant expiresAt) {
        boolean isValid() {
            return Instant.now().isBefore(expiresAt);
        }
    }

    // --- Raw shapes returned by the CoinGecko API, used only for deserialization ---

    private record CoinGeckoMarketItem(
            String id,
            String symbol,
            String name,
            String image,
            @JsonProperty("current_price") double currentPrice,
            @JsonProperty("market_cap") long marketCap,
            @JsonProperty("market_cap_rank") Integer marketCapRank,
            @JsonProperty("total_volume") long totalVolume,
            @JsonProperty("high_24h") Double high24h,
            @JsonProperty("low_24h") Double low24h,
            @JsonProperty("price_change_percentage_24h") Double priceChangePercentage24h
    ) {}

    private record CoinGeckoDetailResponse(
            String id,
            String symbol,
            String name,
            CoinGeckoDescription description,
            CoinGeckoImage image,
            @JsonProperty("market_cap_rank") Integer marketCapRank,
            @JsonProperty("market_data") CoinGeckoMarketData marketData,
            CoinGeckoLinks links
    ) {}

    private record CoinGeckoDescription(String en) {}

    private record CoinGeckoImage(String large) {}

    private record CoinGeckoLinks(List<String> homepage) {}

    private record CoinGeckoMarketData(
            @JsonProperty("current_price") CoinGeckoUsdValue currentPrice,
            @JsonProperty("market_cap") CoinGeckoUsdValue marketCap,
            @JsonProperty("total_volume") CoinGeckoUsdValue totalVolume,
            @JsonProperty("high_24h") CoinGeckoUsdValue high24h,
            @JsonProperty("low_24h") CoinGeckoUsdValue low24h,
            @JsonProperty("price_change_percentage_24h") Double priceChangePercentage24h,
            @JsonProperty("price_change_percentage_7d") Double priceChangePercentage7d,
            CoinGeckoUsdValue ath,
            @JsonProperty("ath_change_percentage") CoinGeckoUsdValue athChangePercentage,
            @JsonProperty("circulating_supply") double circulatingSupply
    ) {}

    private record CoinGeckoUsdValue(double usd) {}

    private record CoinGeckoChartResponse(List<List<Double>> prices) {}
}
