package com.orion.newsdaily.newsTag;

import com.orion.newsdaily.newsArticle.NewsArticle;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/newstag")
@RequiredArgsConstructor
public class NewsTagController {

    @Autowired
    private final NewsTagService newsTagService;

    @GetMapping("/{newsid}")
    public ResponseEntity<List<String>> findAll(@PathVariable("newsid") long newsId) {
        List<Long> newsTagIds = newsTagService.findTagsByNewsArticleId(newsId);

        List<String> newsTags=newsTagService.getTagNamesByTagIds(newsTagIds);
        return ResponseEntity.ok(newsTags);
    }
    @GetMapping
    public ResponseEntity<List<NewsTag>> findAll() {

        return ResponseEntity.ok(newsTagService.newsTagRepo.findAll());
    }
    @GetMapping("/newsbytag/{tag}")
    public ResponseEntity<List<NewsArticle>> findAllByTag(@PathVariable("tag") Long tag) {

        return ResponseEntity.ok(newsTagService.findAllNewsOfATag(tag));
    }

}
