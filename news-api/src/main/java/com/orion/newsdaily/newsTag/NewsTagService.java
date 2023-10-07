package com.orion.newsdaily.newsTag;

import com.orion.newsdaily.newsArticle.NewsArticle;
import com.orion.newsdaily.newsArticle.NewsArticleService;
import com.orion.newsdaily.tag.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NewsTagService {

    @Autowired
    public NewsTagRepo newsTagRepo;
    @Autowired
    public TagService tagService;

    @Autowired
    public NewsArticleService newsService;
    
    
    public List<Long> findTagsByNewsArticleId(long newsId) {
        return newsTagRepo.findAllByNewsArticleId(newsId);
    }

    public void addTag(Long newsId, String tagIdList) {

        List<Long> idList = new ArrayList<>();
        String[] idStrings = tagIdList.split(",");

        for (String idString : idStrings) {
            try {
                Long id = Long.parseLong(idString.trim());
                idList.add(id);
            } catch (NumberFormatException e) {

                System.err.println("Skipping non-numeric value: " + idString);
            }
        }
        List<NewsTag> newsTags = new ArrayList<>();
        for (Long id : idList) {
            NewsTag newsTag = new NewsTag();
            newsTag.setNewsArticleId(newsId);
            newsTag.setTagId(id);
            newsTagRepo.save(newsTag);
            newsTags.add(newsTag);
        }
    }

    public int deleteAllByNewsArticleId(Long id){
        return newsTagRepo.deleteAllByNewsArticleId(id);
    }
    public List<String> getTagNamesByTagIds(List<Long> tagNames) {
        return tagNames.stream()
                .map(tagId -> tagService.getTagNameById(tagId))
                .collect(Collectors.toList());
    }

    public List<NewsArticle> findAllNewsOfATag(Long tagId) {
        List<Long> allNewsByTagId=newsTagRepo.findAllNewsByTagId(tagId);
        List<NewsArticle> newsArticleList = new ArrayList<>();

        for (Long newsId : allNewsByTagId) {
            NewsArticle newsArticle = newsService.findById(newsId);
            if (newsArticle != null) {
                newsArticleList.add(newsArticle);
            }
        }

        return newsArticleList;
        
    }
}