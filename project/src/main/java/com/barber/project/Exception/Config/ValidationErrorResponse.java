package com.barber.project.Exception.Config;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ValidationErrorResponse {
    private String error;
    private String message;
    private List<String> details;
}

