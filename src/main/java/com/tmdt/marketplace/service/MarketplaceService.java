package com.tmdt.marketplace.service;

import com.tmdt.marketplace.model.CustomQuote;
import com.tmdt.marketplace.model.CustomRequest;
import com.tmdt.marketplace.model.CustomRequestStatus;
import com.tmdt.marketplace.model.Order;
import com.tmdt.marketplace.model.OrderItem;
import com.tmdt.marketplace.model.OrderStatus;
import com.tmdt.marketplace.model.Product;
import com.tmdt.marketplace.model.ProductStatus;
import com.tmdt.marketplace.model.Shop;
import com.tmdt.marketplace.model.User;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class MarketplaceService {

    private final List<Shop> shops = new CopyOnWriteArrayList<>(List.of(
            new Shop(1L, "Artist", "Khoa Pham", "Thu tay rieng", "12 Ha Noi"),
            new Shop(2L, "Moomoo", "Khang Pham", "Origami va giay thu cong", "45 Da Nang")
    ));

    private final List<User> users = new CopyOnWriteArrayList<>(List.of(
            new User(1L, "Khoa Pham", "khoa@gmail.com", "SELLER", 1L),
            new User(2L, "Khang Pham", "khang@gmail.com", "SELLER", 2L),
            new User(3L, "Elon Musk", "elon@gmail.com", "BUYER", null),
            new User(4L, "Admin", "admin@test.com", "ADMIN", null)
    ));

    private final List<Product> products = new CopyOnWriteArrayList<>(List.of(
            new Product(1L, "Petals & Parchment", "Letterpress", 24.0, false, "/images/placeholder-1.png", "Luna Press", 1L, ProductStatus.ACTIVE, 25),
            new Product(2L, "Golden Solstice", "Birthday", 36.0, true, "/images/placeholder-2.png", "Golden Fold", 2L, ProductStatus.ACTIVE, 12),
            new Product(3L, "Indigo Dreams", "Anniversary", 48.0, true, "/images/placeholder-3.png", "Luna Press", 1L, ProductStatus.ACTIVE, 8),
            new Product(4L, "Botanical Keepsake", "Thinking of You", 52.0, true, "/images/placeholder-4.png", "Golden Fold", 2L, ProductStatus.ACTIVE, 6)
    ));

    private final List<Order> orders = new CopyOnWriteArrayList<>(List.of(
            new Order(
                    88292024L,
                    OrderStatus.CONFIRMED,
                    1L,
                    "1284 Hai Ba Trung, Ha NoiS",
                    "Elon Musk",
                    List.of(
                            new OrderItem(2L, "Hand-Carved Earthen Vase", 1, 320.0),
                            new OrderItem(4L, "Botanical Keepsake", 1, 52.0)
                    ),
                    390.45
            )
    ));

    private final List<CustomRequest> customRequests = new CopyOnWriteArrayList<>(List.of(
            new CustomRequest(
                    1001L,
                    3L,
                    "Elon Musk",
                    1L,
                    "Wedding letterpress set",
                    "Bo thiep cuoi mau dia trung, 80 set, in noi.",
                    420.0,
                    CustomRequestStatus.PENDING,
                    null,
                    Instant.now().minusSeconds(3600)
            )
    ));

    private final List<CustomQuote> customQuotes = new CopyOnWriteArrayList<>();

    private final AtomicLong productSeq = new AtomicLong(100L);
    private final AtomicLong orderSeq = new AtomicLong(900_000_000L);
    private final AtomicLong customRequestSeq = new AtomicLong(2000L);
    private final AtomicLong customQuoteSeq = new AtomicLong(5000L);
    private final AtomicLong shopSeq = new AtomicLong(10L);

    // ===== Products =====

    public List<Product> getProducts() {
        return products;
    }

    public List<Product> getActiveProducts() {
        return products.stream().filter(p -> p.status() == ProductStatus.ACTIVE).toList();
    }

    public List<Product> getProductsByShop(Long shopId) {
        return products.stream().filter(p -> shopId.equals(p.shopId())).toList();
    }

    public Optional<Product> findProduct(Long id) {
        return products.stream().filter(p -> p.id().equals(id)).findFirst();
    }

    public Product createProduct(Product input) {
        Product saved = new Product(
                productSeq.incrementAndGet(),
                input.name(),
                input.category(),
                input.price(),
                input.customizable(),
                input.image() != null ? input.image() : "/images/placeholder-1.png",
                input.artisan(),
                input.shopId(),
                input.status() != null ? input.status() : ProductStatus.ACTIVE,
                input.stock()
        );
        products.add(saved);
        return saved;
    }

    public Optional<Product> updateProduct(Long id, Product input) {
        return findProduct(id).map(existing -> {
            Product updated = new Product(
                    existing.id(),
                    input.name() != null ? input.name() : existing.name(),
                    input.category() != null ? input.category() : existing.category(),
                    input.price(),
                    input.customizable(),
                    input.image() != null ? input.image() : existing.image(),
                    input.artisan() != null ? input.artisan() : existing.artisan(),
                    existing.shopId(),
                    input.status() != null ? input.status() : existing.status(),
                    input.stock()
            );
            products.set(products.indexOf(existing), updated);
            return updated;
        });
    }

    public Optional<Product> updateProductStatus(Long id, ProductStatus status) {
        return findProduct(id).map(existing -> {
            Product updated = new Product(
                    existing.id(),
                    existing.name(),
                    existing.category(),
                    existing.price(),
                    existing.customizable(),
                    existing.image(),
                    existing.artisan(),
                    existing.shopId(),
                    status,
                    existing.stock()
            );
            products.set(products.indexOf(existing), updated);
            return updated;
        });
    }

    public boolean deleteProduct(Long id) {
        return findProduct(id).map(products::remove).orElse(false);
    }

    // ===== Orders =====

    public List<Order> getOrders() {
        return orders;
    }

    public List<Order> getOrdersByShop(Long shopId) {
        return orders.stream().filter(o -> shopId.equals(o.shopId())).toList();
    }

    public Optional<Order> findOrder(Long id) {
        return orders.stream().filter(o -> o.id().equals(id)).findFirst();
    }

    public Optional<Order> updateOrderStatus(Long id, OrderStatus status) {
        return findOrder(id).map(existing -> {
            Order updated = new Order(
                    existing.id(),
                    status,
                    existing.shopId(),
                    existing.shippingAddress(),
                    existing.receiverName(),
                    existing.items(),
                    existing.total()
            );
            orders.set(orders.indexOf(existing), updated);
            return updated;
        });
    }

    // ===== Shops =====

    public List<Shop> getShops() {
        return shops;
    }

    public Optional<Shop> findShop(Long id) {
        return shops.stream().filter(s -> s.id().equals(id)).findFirst();
    }

    public Optional<Shop> updateShop(Long id, Shop input) {
        return findShop(id).map(existing -> {
            Shop updated = new Shop(
                    existing.id(),
                    input.name() != null ? input.name() : existing.name(),
                    input.ownerName() != null ? input.ownerName() : existing.ownerName(),
                    input.description() != null ? input.description() : existing.description(),
                    input.address() != null ? input.address() : existing.address()
            );
            shops.set(shops.indexOf(existing), updated);
            return updated;
        });
    }

    public Shop createShop(Shop input) {
        Shop saved = new Shop(
                shopSeq.incrementAndGet(),
                input.name(),
                input.ownerName(),
                input.description(),
                input.address()
        );
        shops.add(saved);
        return saved;
    }

    // ===== Users (admin lite) =====

    public List<User> getUsers() {
        return users;
    }

    public Optional<User> findUser(Long id) {
        return users.stream().filter(u -> u.id().equals(id)).findFirst();
    }

    public Optional<User> promoteUserToSeller(Long userId, Long shopId) {
        return findUser(userId).map(existing -> {
            User updated = new User(
                    existing.id(),
                    existing.fullName(),
                    existing.email(),
                    "SELLER",
                    shopId
            );
            users.set(users.indexOf(existing), updated);
            return updated;
        });
    }

    // ===== Custom Requests =====

    public List<CustomRequest> getCustomRequests() {
        return customRequests;
    }

    public List<CustomRequest> getCustomRequestsByShop(Long shopId) {
        return customRequests.stream().filter(r -> shopId.equals(r.shopId())).toList();
    }

    public List<CustomRequest> getCustomRequestsByBuyer(Long buyerId) {
        return customRequests.stream().filter(r -> buyerId.equals(r.buyerId())).toList();
    }

    public Optional<CustomRequest> findCustomRequest(Long id) {
        return customRequests.stream().filter(r -> r.id().equals(id)).findFirst();
    }

    public CustomRequest createCustomRequest(CustomRequest input) {
        CustomRequest saved = new CustomRequest(
                customRequestSeq.incrementAndGet(),
                input.buyerId(),
                input.buyerName(),
                input.shopId(),
                input.title(),
                input.description(),
                input.budget(),
                CustomRequestStatus.PENDING,
                null,
                Instant.now()
        );
        customRequests.add(saved);
        return saved;
    }

    public Optional<CustomRequest> updateCustomRequestStatus(Long id, CustomRequestStatus status, Long acceptedQuoteId) {
        return findCustomRequest(id).map(existing -> {
            CustomRequest updated = new CustomRequest(
                    existing.id(),
                    existing.buyerId(),
                    existing.buyerName(),
                    existing.shopId(),
                    existing.title(),
                    existing.description(),
                    existing.budget(),
                    status,
                    acceptedQuoteId != null ? acceptedQuoteId : existing.acceptedQuoteId(),
                    existing.createdAt()
            );
            customRequests.set(customRequests.indexOf(existing), updated);
            return updated;
        });
    }

    // ===== Custom Quotes =====

    public List<CustomQuote> getQuotesByRequest(Long requestId) {
        return customQuotes.stream().filter(q -> requestId.equals(q.requestId())).toList();
    }

    public Optional<CustomQuote> findCustomQuote(Long id) {
        return customQuotes.stream().filter(q -> q.id().equals(id)).findFirst();
    }

    public CustomQuote createCustomQuote(CustomQuote input) {
        CustomQuote saved = new CustomQuote(
                customQuoteSeq.incrementAndGet(),
                input.requestId(),
                input.shopId(),
                input.price(),
                input.leadTimeDays(),
                input.note(),
                Instant.now()
        );
        customQuotes.add(saved);
        updateCustomRequestStatus(input.requestId(), CustomRequestStatus.QUOTED, null);
        return saved;
    }

    // ===== Dashboards =====

    public List<Object> overviewForShop(Long shopId) {
        List<Product> shopProducts = getProductsByShop(shopId);
        List<Order> shopOrders = getOrdersByShop(shopId);
        double revenue = shopOrders.stream()
                .filter(o -> o.status() == OrderStatus.DELIVERED || o.status() == OrderStatus.SHIPPING)
                .mapToDouble(Order::total)
                .sum();
        return new ArrayList<>(List.of(
                shopProducts.size(),
                shopOrders.size(),
                revenue,
                getCustomRequestsByShop(shopId).size()
        ));
    }
}
