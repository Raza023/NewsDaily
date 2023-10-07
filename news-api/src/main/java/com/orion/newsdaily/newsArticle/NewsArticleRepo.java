package com.orion.newsdaily.newsArticle;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsArticleRepo extends JpaRepository<NewsArticle, Long > {
    @Query(value = "SELECT * FROM news_articles WHERE is_approved = false AND is_disabled = false AND is_ad = false", nativeQuery = true)
    List<NewsArticle> findPendingNews();
    @Query(value = "SELECT * FROM news_articles WHERE fk_user_id = ?1 AND is_approved = false AND is_disabled = false AND is_ad = false", nativeQuery = true)
    List<NewsArticle> findMyPendingNews(long id);
    @Query(value = "SELECT * FROM news_articles WHERE is_approved = true AND is_disabled = false AND is_ad = false order by POSTED_AT DESC", nativeQuery = true)
    List<NewsArticle> findAllNews();

    @Query(value = "SELECT * FROM news_article WHERE is_approved = true AND is_disabled = false AND is_ad = false", nativeQuery = true)
    List<NewsArticle> findAllNotAd();

    @Query(value = "SELECT * FROM news_articles WHERE is_approved = true AND is_disabled = false AND is_ad = true", nativeQuery = true)
    List<NewsArticle> findAllAds();

    @Query(value = "SELECT * FROM news_articles WHERE is_approved = true AND is_disabled = false AND is_ad = true ORDER BY 2", nativeQuery = true)
    List<NewsArticle> findAllAdsByUserPref();
    @Query(value = "SELECT * FROM news_articles WHERE is_approved = true AND is_ad = false", nativeQuery = true)
    List<NewsArticle> findAllNewsForEditor();

    @Query(value = "SELECT * FROM news_articles WHERE is_approved = true AND is_disabled = false AND is_ad = false", nativeQuery = true)
    List<NewsArticle> findAllNewsForUser();

    @Query("SELECT na FROM NewsArticle na JOIN na.comments c WHERE c.id = :cmtId")
    NewsArticle findNewsByCommentId(Long cmtId);

    @Query(value = "SELECT * FROM news_articles WHERE fk_user_id = (SELECT id FROM users WHERE username = ?1) AND is_approved = false AND is_disabled = false", nativeQuery = true)
    List<NewsArticle> findReporterPendingNews(String username);

    @Query(value = "SELECT DISTINCT na.* FROM news_articles na JOIN news_tags nt ON na.id = nt.news_article_id WHERE na.is_ad = true AND nt.tag_id IN ?1", nativeQuery = true)
    List<NewsArticle> getMyAds(List<Long> list);

    @Query(value = "SELECT DISTINCT na.* FROM news_articles na JOIN news_tags nt ON na.id = nt.news_article_id WHERE na.is_ad = false AND nt.tag_id IN ?1", nativeQuery = true)
    List<NewsArticle> findFilteredNews(List<Long> list);

}