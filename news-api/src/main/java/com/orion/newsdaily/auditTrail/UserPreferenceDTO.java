package com.orion.newsdaily.auditTrail;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@Data
@AllArgsConstructor
public class UserPreferenceDTO {
    private Long id;
    private Long newsId;
    private LocalDateTime createdAt;
    private String ipAddress;
    private Long userId;
    private List<String> tagNames;
}
