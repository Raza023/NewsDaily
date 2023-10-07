package com.orion.newsdaily.tag;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.orion.newsdaily.newsArticle.NewsArticle;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="tags")
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NonNull
    private String name;

    @ManyToMany(mappedBy = "tags",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<NewsArticle> newsArticles;
}
