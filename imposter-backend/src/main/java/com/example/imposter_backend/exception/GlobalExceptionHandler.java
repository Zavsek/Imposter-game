package com.example.imposter_backend.exception;

import com.example.imposter_backend.response.ApiException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import com.example.imposter_backend.response.ApiResponse;


@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler  {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiException> handleResourceNotFound(ResourceNotFoundException ex) {
        ApiException response = new ApiException("Resource not found", HttpStatus.NOT_FOUND);
        log.error(ex.getMessage(), ex);
        return new ResponseEntity<>(response,HttpStatus.NOT_FOUND);
    }


    @ExceptionHandler(IllegalAccessException.class)
    public ResponseEntity<ApiException> handleIllegalAccesException (IllegalAccessException ex){
        ApiException response = new ApiException("Illegal Access", HttpStatus.FORBIDDEN);
        log.error(ex.getMessage(), ex);
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiException> handleGeneralException(Exception ex) {
        ApiException response = new ApiException("An internal server error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
        log.error(ex.getMessage(), ex);
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }


    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiException> handleIllegalStateException(IllegalStateException ex) {
        log.error(ex.getMessage(), ex);
        return new ResponseEntity<>(
                new ApiException("Attempted to access an unexpected state", HttpStatus.INTERNAL_SERVER_ERROR
        ), HttpStatus.INTERNAL_SERVER_ERROR);
    }


    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiException> handleIllegalArgumentException(IllegalArgumentException ex) {
        log.error(ex.getMessage(), ex);
        HttpStatus status = HttpStatus.BAD_REQUEST;
        return new ResponseEntity<>(
                new ApiException("An illegal argument was passed", status),
                status
        );
    }


    //WebSocket Exceptions
    @MessageExceptionHandler(IllegalArgumentException.class)
    @SendToUser("/queue/errors")
    public ApiResponse handleWebSocketIllegalArgument(IllegalArgumentException ex) {
        return new ApiResponse("WS Error: " + ex.getMessage(), null);
    }
}
