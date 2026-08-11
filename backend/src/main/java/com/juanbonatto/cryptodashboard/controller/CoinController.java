package com.juanbonatto.cryptodashboard.controller;

import com.juanbonatto.cryptodashboard.dto.CoinDetailDto;
import com.juanbonatto.cryptodashboard.dto.CoinDto;
import com.juanbonatto.cryptodashboard.dto.MarketChartPointDto;
import com.juanbonatto.cryptodashboard.exception.ApiException;
import com.juanbonatto.cryptodashboard.service.CoinService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/coins")
public class CoinController {

    private static final Set<Integer> ALLOWED_DAYS = Set.of(1, 7, 30, 365);

    private final CoinService coinService;

    public CoinController(CoinService coinService) {
        this.coinService = coinService;
    }

    @GetMapping
    public List<CoinDto> getMarkets() {
        return coinService.getMarkets();
    }

    @GetMapping("/{id}")
    public CoinDetailDto getCoinDetail(@PathVariable String id) {
        return coinService.getCoinDetail(id);
    }

    @GetMapping("/{id}/chart")
    public List<MarketChartPointDto> getMarketChart(@PathVariable String id, @RequestParam(defaultValue = "7") int days) {
        if (!ALLOWED_DAYS.contains(days)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "days must be one of " + ALLOWED_DAYS);
        }
        return coinService.getMarketChart(id, days);
    }
}
