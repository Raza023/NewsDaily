package com.orion.newsdaily.newsTag;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="news_tags")
public class NewsTag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    @Column(name = "news_article_id")
    private long newsArticleId;

    @NonNull
    @Column(name = "tag_id")
    private long tagId;
}
