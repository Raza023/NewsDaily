package com.orion.newsdaily.auditTrail;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/audit")
@RequiredArgsConstructor
public class AuditTrailController {

    @Autowired
    private final AuditTrailService auditTrailService;
    @PostMapping("/{newsId}")
    public ResponseEntity<AuditTrail> create(@PathVariable("newsId") long newsId, Authentication authentication) {
        auditTrailService.create(authentication, newsId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    @GetMapping
    public ResponseEntity<Map<String, List<UserPreferenceDTO>>> getUserPreferences(){
        List<UserPreferenceDTO> userPreference=auditTrailService.getUserPreferences();
        return ResponseEntity.ok(Map.of("content", userPreference));
    }
}
