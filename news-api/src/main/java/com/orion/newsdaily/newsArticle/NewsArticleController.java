package com.orion.newsdaily.newsArticle;

import com.orion.newsdaily.ads.AdsService;
import com.orion.newsdaily.newsTag.NewsTagService;
import com.orion.newsdaily.user.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;


@RestController
@RequestMapping("/api/v1/news")
@RequiredArgsConstructor
public class NewsArticleController {

    @Autowired
    private final NewsArticleService newsArticleService;
    @Autowired
    private final UserService userService;
    @Autowired
    private final NewsTagService newsTagService;

    @Autowired
    private final AdsService adsService;
    private final Logger logger = LoggerFactory.getLogger(getClass());


    @PreAuthorize("hasAnyAuthority('EDITOR', 'REPORTER')")
    @PostMapping
    public ResponseEntity<NewsArticle> create(
            Authentication authentication,
            @RequestBody NewsArticle newsArticle,
            @RequestParam(name = "tags") String tagsParam
    ) {

        NewsArticle created = newsArticleService.create(newsArticle, authentication);
        newsTagService.addTag(created.getId(), tagsParam);
        if (created != null ) {
            return ResponseEntity.ok(created);
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    @PreAuthorize("hasAnyAuthority('REPORTER', 'USER')")
    @GetMapping("/filter")
    public ResponseEntity<List<NewsArticle>> filter(
            Authentication authentication,
            @RequestParam(name = "tags") String tagsParam
    ) {
        System.out.print(tagsParam+"acha");
        List<NewsArticle> newsArticles = newsArticleService.findFilteredNews(tagsParam);
        return ResponseEntity.ok(newsArticles);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('USER', 'REPORTER')")
    public ResponseEntity<List<NewsArticle>> findAll(@AuthenticationPrincipal OAuth2User principal,
                                          @RequestParam(name = "email", defaultValue = "") String email,
                                          @RequestParam(name = "name", defaultValue = "") String name)
    {

        List<NewsArticle> newsArticles = newsArticleService.findAll();
        return ResponseEntity.ok(newsArticles);
    }

    @PreAuthorize("hasAuthority('EDITOR')")
    @GetMapping("/pending")
    public ResponseEntity<List<NewsArticle>> findPendingNews() {
        return ResponseEntity.ok(newsArticleService.findPendingNews());
    }

    @PreAuthorize("hasAuthority('EDITOR')")
    @PutMapping("/approve/{id}")
    public ResponseEntity<NewsArticle> approveNewsToggle(@PathVariable("id") long id) {
        NewsArticle updated = newsArticleService.approveNewsToggle(id);
        if (updated==null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasAuthority('EDITOR')")
    @PutMapping("/disable/{id}")
    public ResponseEntity<NewsArticle> disableNewsToggle(@PathVariable("id") long id) {
        NewsArticle updated = newsArticleService.disableNewsToggle(id);
        if (updated==null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('EDITOR', 'REPORTER')")
    public ResponseEntity<NewsArticle> delete(@PathVariable("id") Long id) {
        NewsArticle newsArticle = newsArticleService.findById(id);
        newsTagService.deleteAllByNewsArticleId(id);
        newsArticleService.delete(newsArticle);
        return ResponseEntity.ok(newsArticle);
    }

    @GetMapping("/report/{id}")
    public ResponseEntity<String> getUsernameByNewsId(@PathVariable Long id) {
        NewsArticle newsArticle = newsArticleService.findById(id);
        String username = newsArticle.getUser().getUsername();
        return ResponseEntity.ok(username);
    }

    @GetMapping("/editor")
    @PreAuthorize("hasAuthority('EDITOR')")
    public ResponseEntity<List<NewsArticle>> findAllNewsForEditor() {
        List<NewsArticle> newsArticles = newsArticleService.findAllNewsForEditor();
        return ResponseEntity.ok(newsArticles);

    }

    @GetMapping("/my-ads")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<List<NewsArticle>> findMyAds() {
        List<NewsArticle> newsArticles = adsService.findMyAds();
        return ResponseEntity.ok(newsArticles);

    }

    @GetMapping("/newsByComment/{cmtId}")
    @PreAuthorize("hasAuthority('EDITOR')")
    public ResponseEntity<NewsArticle> findNewsByCommentId(@PathVariable Long cmtId) {
        NewsArticle newsArticle = newsArticleService.findNewsByCommentId(cmtId);
        if (newsArticle == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(newsArticle);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('EDITOR')")
    public ResponseEntity<NewsArticle> findById(@PathVariable Long id) {
        NewsArticle newsArticle = newsArticleService.findById(id);
        if (newsArticle == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(newsArticle);
    }

    @GetMapping("/reporter-pending-news")
    @PreAuthorize("hasAuthority('REPORTER')")
    public ResponseEntity<List<NewsArticle>> findReporterPendingNews(Authentication auth) {
        List<NewsArticle> newsArticles = newsArticleService.findReporterPendingNews(auth.getName());
        return ResponseEntity.ok(newsArticles);
    }

}
