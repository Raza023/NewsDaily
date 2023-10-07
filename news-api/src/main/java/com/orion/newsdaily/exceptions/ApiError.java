package com.orion.newsdaily.exceptions;


import java.time.LocalDateTime;

import lombok.*;
import org.springframework.http.HttpStatus;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApiError {

    private HttpStatus httpStatus;
    private String message;
    private LocalDateTime timestamp;
    private int status;
}