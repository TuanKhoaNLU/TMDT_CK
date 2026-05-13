package com.tmdt.marketplace.model;

import java.time.Instant;

public record CustomQuote(
        Long id,
        Long requestId,
        Long shopId,
        double price,
        int leadTimeDays,
        String note,
        Instant createdAt
) {
}
