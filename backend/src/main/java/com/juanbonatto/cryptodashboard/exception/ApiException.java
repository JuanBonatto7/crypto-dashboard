package com.juanbonatto.cryptodashboard.exception;

import org.springframework.http.HttpStatus;

/** Thrown deliberately by our own code (invalid input, not found, etc.) with the HTTP status it should map to. */
public class ApiException extends RuntimeException {

    private final HttpStatus status;

    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
