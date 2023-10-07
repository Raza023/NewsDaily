package com.orion.newsdaily.comment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepo extends JpaRepository <Comment, Long> {

    @Query(value = "SELECT * FROM comments WHERE fk_user_id = ?1 AND is_approved = false", nativeQuery = true)
    List<Comment> findPendingCommentsByUserId(Long id);

    @Query(value = "SELECT * FROM comments WHERE fk_news_article_id = ?1 AND is_approved = true AND is_disabled = false", nativeQuery = true)
    List<Comment> NewsSpecificComments(Long id);

    @Query(value = "SELECT * FROM comments WHERE is_approved = false AND is_disabled = false", nativeQuery = true)
    List<Comment> findPendingComments();

    @Query(value = "SELECT * FROM comments WHERE is_approved = true", nativeQuery = true)
    List<Comment> findAllCommentsForEditor();

    @Query(value = "SELECT * FROM comments WHERE is_approved = true AND is_disabled = false", nativeQuery = true)
    List<Comment> findAllNewsForUser();

    @Query(value = "SELECT fk_user_id FROM comments WHERE id = ?1", nativeQuery = true)
    Long getUsernameOfComment(Long id);

    @Query(value = "SELECT * FROM comments WHERE fk_user_id = (SELECT id FROM users WHERE username = ?1) AND is_approved = false AND is_disabled = false", nativeQuery = true)
    List<Comment> findUserPendingComments(String name);

    @Query(value = "SELECT fk_user_id FROM comments", nativeQuery = true)
    List<Long> getAllUserIds();
}
