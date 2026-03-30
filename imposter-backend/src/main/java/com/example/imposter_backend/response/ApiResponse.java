package com.example.imposter_backend.response;

public class ApiResponse {


    private String message;
    private Object data;
    

    public ApiResponse(String message, Object data) {
        this.message = message;
        this.data = data;
    }

    public Object getData() {
        return data;
    }

    public String getMessage() {
        return message;
    }


}
