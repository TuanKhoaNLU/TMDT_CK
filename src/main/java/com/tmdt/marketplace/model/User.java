package com.tmdt.marketplace.model;

public record User(
        Long id,
        String fullName,
        String email,
        String role,
        Long shopId
) {
}
