package com.orion.newsdaily.auditTrail;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.orion.newsdaily.newsTag.NewsTagService;
import com.orion.newsdaily.tag.TagService;
import com.orion.newsdaily.user.User;
import com.orion.newsdaily.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class AuditTrailService {
    @Autowired
    private final AuditTrailRepo auditTrailRepo;
    @Autowired
    private final NewsTagService newsTagService;
    @Autowired
    private final TagService tagService;
    @Autowired
    private final UserService userService;



    public void create(Authentication authentication, long newsId) {
        String username=authentication.getName();

        User user=userService.findByUserName(username);

        AuditTrail record=new AuditTrail();
        record.setNewsId(newsId);
        record.setCreatedAt(LocalDateTime.now());
        record.setIpAddress(getIpAddress());
        record.setUser(user);

        auditTrailRepo.save(record);

    }

    public List<AuditTrail> findAll(){
        return auditTrailRepo.findAll();

    }

    public String getIpAddress(){
        try {
            URL url = new URL("https://httpbin.org/ip");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(response.toString());
            String ipAddress = jsonNode.get("origin").asText();
            return ipAddress;


        } catch (IOException e) {
            e.printStackTrace();
        }
        return "";
    }
    public List<String> getTagNamesByTagIds(List<Long> tagNames) {
        return tagNames.stream()
                .map(tagId -> tagService.getTagNameById(tagId))
                .collect(Collectors.toList());
    }
    public List<UserPreferenceDTO> getUserPreferences() {
        List<AuditTrail> auditTrails = auditTrailRepo.findAll();
        return auditTrails.stream()
                .map(auditTrail -> new UserPreferenceDTO(
                                        auditTrail.getId(), auditTrail.getNewsId(),
                        auditTrail.getCreatedAt(),
                        auditTrail.getIpAddress(),
                        auditTrail.getUser().getId(),
                        getTagNamesByTagIds(newsTagService.findTagsByNewsArticleId(auditTrail.getNewsId()))
                                )
                )
                .collect(Collectors.toList());
    }

    public List<Long> getUserPreferencesByUserId(Authentication auth) {
        List<AuditTrail> auditTrails = auditTrailRepo.findLatest2ByUserId(userService.findIdByUserName(auth.getName())); // Assuming you have a custom repository method for filtering by user ID

        return auditTrails.stream()
                .flatMap(auditTrail -> newsTagService.findTagsByNewsArticleId(auditTrail.getNewsId()).stream())
                .collect(Collectors.toList());
    }


}
