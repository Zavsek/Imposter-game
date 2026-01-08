package com.example.imposter_backend.service;


import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    public Bucket resolveBucket(String ip, String path) {
        String key = ip + ":" + getLimitCategory(path);
        return buckets.computeIfAbsent(key, k -> createNewBucket(path));
    }

    private String getLimitCategory(String path) {
        if (path.startsWith("/api/auth")) return "AUTH";
        if (path.startsWith("/api/games/create")) return "CREATE";
        return "GENERAL";
    }

    private Bucket createNewBucket(String path) {
        Bandwidth limit;

        if (path.startsWith("/api/auth")) {

            limit = Bandwidth.classic(5, Refill.intervally(5, Duration.ofMinutes(5)));
        } else if (path.startsWith("/api/games/create")) {
            limit = Bandwidth.classic(3, Refill.intervally(3, Duration.ofMinutes(1)));
        } else {
            limit = Bandwidth.classic(60, Refill.intervally(60, Duration.ofMinutes(1)));
        }

        return Bucket.builder().addLimit(limit).build();
    }
}