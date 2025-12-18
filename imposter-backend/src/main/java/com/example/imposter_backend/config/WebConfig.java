package com.example.imposter_backend.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private RateLimitInterceptor rateLimitInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // Registriramo interceptor za vse API klice
        registry.addInterceptor(rateLimitInterceptor)
                .addPathPatterns("/api/**") // Zaščitimo vse pod /api
                .excludePathPatterns("/api/public/**"); // Opcijsko: izpustimo kakšne javne vire
    }
}
