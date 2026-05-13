package com.tmdt.marketplace.model;

import java.time.Instant;

public record CustomRequest(
        Long id,
        Long buyerId,
        String buyerName,
        Long shopId,
        String title,
        String description,
        double budget,
        CustomRequestStatus status,
        Long acceptedQuoteId,
        Instant createdAt
) {
}
