package com.tmdt.marketplace.controller;

import com.tmdt.marketplace.model.Shop;
import com.tmdt.marketplace.model.User;
import com.tmdt.marketplace.service.MarketplaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/shops")
public class ShopController {

    private final MarketplaceService service;

    public ShopController(MarketplaceService service) {
        this.service = service;
    }

    public record RegisterShopRequest(Long buyerId, String name, String description, String address) {
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterShopRequest req) {
        if (req.buyerId() == null || req.name() == null || req.name().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "buyerId va name la bat buoc"));
        }

        return service.findUser(req.buyerId())
                .filter(u -> "BUYER".equals(u.role()))
                .filter(u -> u.shopId() == null)
                .map(buyer -> {
                    Shop newShop = service.createShop(new Shop(
                            null,
                            req.name(),
                            buyer.fullName(),
                            req.description(),
                            req.address()
                    ));
                    User updated = service.promoteUserToSeller(buyer.id(), newShop.id())
                            .orElseThrow();
                    return ResponseEntity.ok(Map.<String, Object>of(
                            "user", updated,
                            "shop", newShop
                    ));
                })
                .orElseGet(() -> ResponseEntity.badRequest().body(Map.of(
                        "error", "Khong tim thay buyer hoac da co shop"
                )));
    }
}
