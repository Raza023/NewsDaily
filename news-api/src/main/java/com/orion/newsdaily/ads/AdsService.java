package com.orion.newsdaily.ads;


import com.orion.newsdaily.auditTrail.AuditTrailService;
import com.orion.newsdaily.newsArticle.NewsArticle;
import com.orion.newsdaily.newsArticle.NewsArticleService;
import com.orion.newsdaily.user.UserService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdsService {

    @Autowired
    private final AuditTrailService auditTrailService;

    @Autowired
    private final UserService userService;

    @Autowired
    private final NewsArticleService newsArticleService;

    @PersistenceContext
    private EntityManager entityManager;


    public List<NewsArticle> getAdsByTagList(List<Long> taglist) {


        List<Long> list = auditTrailService.getUserPreferencesByUserId(userService.getAuth());
        return newsArticleService.getMyAds(list);
    }


//    public List<NewsArticle> findMyAds() {
//        return getAdsByTagList(auditTrailService.getUserPreferencesByUserId(userService.getAuth()));
//    }
    public List<NewsArticle> findMyAds() {
        List<NewsArticle> adsList = getAdsByTagList(auditTrailService.getUserPreferencesByUserId(userService.getAuth()));
        Collections.shuffle(adsList);
        if (!adsList.isEmpty()) {
            return Collections.singletonList(adsList.get(0));
        } else {
            return Collections.emptyList();
        }
    }
}
