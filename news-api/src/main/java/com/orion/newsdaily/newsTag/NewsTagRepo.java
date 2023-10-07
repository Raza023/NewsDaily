package com.orion.newsdaily.newsTag;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsTagRepo extends JpaRepository<NewsTag, Long> {
    @Query(value = "SELECT * FROM news_tags WHERE news_article_id = ?1 AND tag_id = ?2", nativeQuery = true)
    NewsTag getIdByNTID(Long nId, Long tId);

    @Query(value = "SELECT tag_id FROM news_tags WHERE news_article_id = ?1", nativeQuery = true)
    List<Long> findAllByNewsArticleId(long newsArticleId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM news_tags WHERE news_article_id = ?1", nativeQuery = true)
    int deleteAllByNewsArticleId(long id);

    @Query(value = "SELECT news_article_id FROM news_tags WHERE tag_id = ?1", nativeQuery = true)
    List<Long> findAllNewsByTagId(long tagId);

}
