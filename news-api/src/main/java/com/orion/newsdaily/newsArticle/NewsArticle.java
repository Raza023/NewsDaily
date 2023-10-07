package com.orion.newsdaily.newsArticle;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.orion.newsdaily.comment.Comment;
import com.orion.newsdaily.tag.Tag;
import com.orion.newsdaily.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name="news_articles")
@NoArgsConstructor
@Data
@AllArgsConstructor
@Getter
@Setter
public class NewsArticle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    private String title;

    @NonNull
    private String content;
    @NonNull
    @Column(name = "posted_at")
    private LocalDateTime postedAt;
    @NonNull
    @Column(name = "is_approved")
    private Boolean isApproved;
    @NonNull
    @Column(name = "is_disabled")
    private Boolean isDisabled;

    @NonNull
    @Column(name = "is_ad")
    private Boolean isAd;

    @ManyToOne
    @JoinColumn(name = "fk_user_id", nullable = false)
    @JsonIgnore
    private User user;

    @OneToMany(mappedBy = "newsArticle", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Comment> comments;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "news_tags", joinColumns = { @JoinColumn(name = "news_article_id") },
            inverseJoinColumns = { @JoinColumn(name = "tag_id") })
    @JsonIgnore
    private List<Tag> tags;
}
