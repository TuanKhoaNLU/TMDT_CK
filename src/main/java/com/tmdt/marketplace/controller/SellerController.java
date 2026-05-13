package com.tmdt.marketplace.controller;

import com.tmdt.marketplace.model.CustomQuote;
import com.tmdt.marketplace.model.CustomRequest;
import com.tmdt.marketplace.model.Order;
import com.tmdt.marketplace.model.OrderStatus;
import com.tmdt.marketplace.model.Product;
import com.tmdt.marketplace.model.Shop;
import com.tmdt.marketplace.service.MarketplaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seller/{shopId}")
public class SellerController {

    private final MarketplaceService service;

    public SellerController(MarketplaceService service) {
        this.service = service;
    }

    @GetMapping("/profile")
    public ResponseEntity<Shop> profile(@PathVariable Long shopId) {
        return service.findShop(shopId).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<Shop> updateProfile(@PathVariable Long shopId, @RequestBody Shop input) {
        return service.updateShop(shopId, input).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/products")
    public List<Product> products(@PathVariable Long shopId) {
        return service.getProductsByShop(shopId);
    }

    @PostMapping("/products")
    public Product createProduct(@PathVariable Long shopId, @RequestBody Product input) {
        Product withShop = new Product(
                null,
                input.name(),
                input.category(),
                input.price(),
                input.customizable(),
                input.image(),
                input.artisan(),
                shopId,
                input.status(),
                input.stock()
        );
        return service.createProduct(withShop);
    }

    @PutMapping("/products/{productId}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long shopId,
            @PathVariable Long productId,
            @RequestBody Product input
    ) {
        return service.findProduct(productId)
                .filter(p -> shopId.equals(p.shopId()))
                .flatMap(p -> service.updateProduct(productId, input))
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/products/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long shopId, @PathVariable Long productId) {
        boolean removed = service.findProduct(productId)
                .filter(p -> shopId.equals(p.shopId()))
                .map(p -> service.deleteProduct(productId))
                .orElse(false);
        return removed ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/orders")
    public List<Order> orders(@PathVariable Long shopId) {
        return service.getOrdersByShop(shopId);
    }

    @PatchMapping("/orders/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long shopId,
            @PathVariable Long orderId,
            @RequestBody Map<String, String> body
    ) {
        String statusValue = body.get("status");
        if (statusValue == null) {
            return ResponseEntity.badRequest().build();
        }
        OrderStatus newStatus;
        try {
            newStatus = OrderStatus.valueOf(statusValue);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
        return service.findOrder(orderId)
                .filter(o -> shopId.equals(o.shopId()))
                .flatMap(o -> service.updateOrderStatus(orderId, newStatus))
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard(@PathVariable Long shopId) {
        List<Object> overview = service.overviewForShop(shopId);
        return Map.of(
                "shopId", shopId,
                "totalProducts", overview.get(0),
                "totalOrders", overview.get(1),
                "totalRevenue", overview.get(2),
                "totalCustomRequests", overview.get(3)
        );
    }

    @GetMapping("/custom-requests")
    public List<CustomRequest> customRequests(@PathVariable Long shopId) {
        return service.getCustomRequestsByShop(shopId);
    }

    @PostMapping("/custom-requests/{requestId}/quotes")
    public ResponseEntity<CustomQuote> createQuote(
            @PathVariable Long shopId,
            @PathVariable Long requestId,
            @RequestBody CustomQuote input
    ) {
        return service.findCustomRequest(requestId)
                .filter(r -> shopId.equals(r.shopId()))
                .map(r -> {
                    CustomQuote toCreate = new CustomQuote(
                            null,
                            requestId,
                            shopId,
                            input.price(),
                            input.leadTimeDays(),
                            input.note(),
                            null
                    );
                    return ResponseEntity.ok(service.createCustomQuote(toCreate));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
