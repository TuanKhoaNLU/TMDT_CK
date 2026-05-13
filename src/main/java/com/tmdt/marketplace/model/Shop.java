package com.tmdt.marketplace.model;

public record Shop(
        Long id,
        String name,
        String ownerName,
        String description,
        String address
) {
}
