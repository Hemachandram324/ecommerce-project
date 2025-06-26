package com.example.ecommerce.payload.response;

import lombok.Data;
import java.util.HashMap;
import java.util.Map;

@Data
public class OkResponse {
    private final Map<String, Object> data = new HashMap<>();

    public OkResponse(String key, Object value) {
        this.data.put(key, value);
    }

    public OkResponse(Map<String, Object> payload) {
        this.data.putAll(payload);
    }
}
