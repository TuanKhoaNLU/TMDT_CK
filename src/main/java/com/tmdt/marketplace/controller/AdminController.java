package com.tmdt.marketplace.controller;

import com.tmdt.marketplace.model.Product;
import com.tmdt.marketplace.model.ProductStatus;
import com.tmdt.marketplace.model.Shop;
import com.tmdt.marketplace.model.User;
import com.tmdt.marketplace.service.MarketplaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final MarketplaceService service;

    public AdminController(MarketplaceService service) {
        this.service = service;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        return Map.of(
                "totalUsers", service.getUsers().size(),
                "totalShops", service.getShops().size(),
                "totalProducts", service.getProducts().size(),
                "totalOrders", service.getOrders().size(),
                "totalCustomRequests", service.getCustomRequests().size()
        );
    }

    @GetMapping("/users")
    public List<User> users() {
        return service.getUsers();
    }

    @GetMapping("/shops")
    public List<Shop> shops() {
        return service.getShops();
    }

    @GetMapping("/products")
    public List<Product> products() {
        return service.getProducts();
    }

    @PatchMapping("/products/{id}/status")
    public ResponseEntity<Product> updateProductStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String statusValue = body.get("status");
        if (statusValue == null) {
            return ResponseEntity.badRequest().build();
        }
        ProductStatus newStatus;
        try {
            newStatus = ProductStatus.valueOf(statusValue);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
        return service.updateProductStatus(id, newStatus)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
