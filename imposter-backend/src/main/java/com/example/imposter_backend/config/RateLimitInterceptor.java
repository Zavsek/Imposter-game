package com.example.imposter_backend.config;

import com.example.imposter_backend.service.RateLimitService;
import io.github.bucket4j.Bucket;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.catalina.util.RateLimiter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    @Autowired
    private RateLimitService rateLimitService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String ip = getClientIp(request);
        String path = request.getRequestURI();

        Bucket bucket = rateLimitService.resolveBucket(ip, path);

        if (bucket.tryConsume(1)) {
            // Dodamo headerje, da frontend ve, koliko poskusov mu še ostane (opcijsko)
            response.addHeader("X-Rate-Limit-Remaining", String.valueOf(bucket.getAvailableTokens()));
            return true;
        } else {
            response.setStatus(429); // Too Many Requests
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Too many requests. Slow down, agent.\"}");
            return false;
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) return request.getRemoteAddr();
        return xfHeader.split(",")[0]; // Za primere, ko uporabljaš proxy/Vercel
    }
}
