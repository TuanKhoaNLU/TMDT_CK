package com.tmdt.marketplace.controller;

import com.tmdt.marketplace.model.CustomQuote;
import com.tmdt.marketplace.model.CustomRequest;
import com.tmdt.marketplace.model.CustomRequestStatus;
import com.tmdt.marketplace.service.MarketplaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/custom-requests")
public class CustomRequestController {

    private final MarketplaceService service;

    public CustomRequestController(MarketplaceService service) {
        this.service = service;
    }

    @GetMapping
    public List<CustomRequest> list(
            @RequestParam(required = false) Long buyerId,
            @RequestParam(required = false) Long shopId
    ) {
        if (buyerId != null) {
            return service.getCustomRequestsByBuyer(buyerId);
        }
        if (shopId != null) {
            return service.getCustomRequestsByShop(shopId);
        }
        return service.getCustomRequests();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomRequest> detail(@PathVariable Long id) {
        return service.findCustomRequest(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public CustomRequest create(@RequestBody CustomRequest input) {
        return service.createCustomRequest(input);
    }

    @GetMapping("/{id}/quotes")
    public List<CustomQuote> quotes(@PathVariable Long id) {
        return service.getQuotesByRequest(id);
    }

    @PostMapping("/{id}/accept-quote/{quoteId}")
    public ResponseEntity<CustomRequest> acceptQuote(@PathVariable Long id, @PathVariable Long quoteId) {
        return service.findCustomQuote(quoteId)
                .filter(q -> id.equals(q.requestId()))
                .flatMap(q -> service.updateCustomRequestStatus(id, CustomRequestStatus.ACCEPTED, quoteId))
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<CustomRequest> reject(@PathVariable Long id) {
        return service.updateCustomRequestStatus(id, CustomRequestStatus.REJECTED, null)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/progress")
    public ResponseEntity<CustomRequest> markInProgress(@PathVariable Long id) {
        return service.updateCustomRequestStatus(id, CustomRequestStatus.IN_PROGRESS, null)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<CustomRequest> markComplete(@PathVariable Long id) {
        return service.updateCustomRequestStatus(id, CustomRequestStatus.COMPLETED, null)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
