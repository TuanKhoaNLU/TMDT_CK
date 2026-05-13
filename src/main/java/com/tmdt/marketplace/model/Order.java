package com.tmdt.marketplace.model;

import java.util.List;

public record Order(
        Long id,
        OrderStatus status,
        Long shopId,
        String shippingAddress,
        String receiverName,
        List<OrderItem> items,
        double total
) {
}
