package com.juanbonatto.cryptodashboard.service;

public class CoinGeckoUnavailableException extends RuntimeException {

    public CoinGeckoUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
