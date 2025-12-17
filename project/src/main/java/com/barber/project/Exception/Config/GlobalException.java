package com.barber.project.Exception.Config;

import com.barber.project.Exception.BadCredentialsException;
import com.barber.project.Exception.BadRequestException;
import com.barber.project.Exception.DuplicateResourceException;
import com.barber.project.Exception.ResourceNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ValidationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalException {

    //metodo reutilizable
    private ResponseEntity<ErrorResponse> BusinessMistake(
            Exception exception,
            HttpServletRequest request,
            HttpStatus status
    ){
        ValidationErrorResponse MistakeResponse = new ValidationErrorResponse(
                "BUSINESS_MISTAKE",
                "Error de logica de negocio",
                List.of(exception.getMessage())
        );
        ErrorResponse response = new ErrorResponse(
                LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                exception.getMessage(),
                request.getRequestURI(),
                List.of(MistakeResponse)
        );
        return ResponseEntity.status(status).body(response);
    }

    //Error Acceso denegado
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleArgumentNoValid(
            AccessDeniedException exception,
            HttpServletRequest request
    ){
        return BusinessMistake(exception,request, HttpStatus.FORBIDDEN);
    }

    //credenciales incorrectas
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(
            BadCredentialsException exception,
            HttpServletRequest request
    ){
        return BusinessMistake(exception,request,HttpStatus.UNAUTHORIZED);
    }

    //recurso no encontrado
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            ResourceNotFoundException exception,
            HttpServletRequest request
    ){
        return BusinessMistake(exception,request,HttpStatus.NOT_FOUND);
    }

    //duplicidad
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicate(
            DuplicateResourceException exception,
            HttpServletRequest request
    ){
        return BusinessMistake(exception,request,HttpStatus.CONFLICT);
    }

    //bad request
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(
            BadRequestException exception,
            HttpServletRequest request
    ){
        return BusinessMistake(exception,request,HttpStatus.BAD_REQUEST);
    }

    //Validaciones
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handlevalidaded(
            ValidationException exception,
            HttpServletRequest request
    ) {
        return BusinessMistake(exception,request,HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(
        MethodArgumentNotValidException exception,
        HttpServletRequest request
    ){
        List<String> details = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());

        ValidationErrorResponse validationError = new ValidationErrorResponse(
                "VALIDATION_ERROR",
                "Los datos de entrada son inválidos",
                details
        );
        ErrorResponse response = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "BAD_REQUEST",
                "Error de validación",
                request.getRequestURI(),
                List.of(validationError)
        );
        return ResponseEntity.badRequest().body(response);
    }

    //operaciones ilegales
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(
            IllegalArgumentException exception,
            HttpServletRequest request
    ) {
        return BusinessMistake(exception, request, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleExepcion(
            Exception exception,
            WebRequest request

    ){
        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                exception.getMessage(),
                request.getDescription(false),
                null
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }



}
