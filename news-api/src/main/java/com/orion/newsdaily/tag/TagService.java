package com.orion.newsdaily.tag;

import com.orion.newsdaily.newsTag.NewsTag;
import com.orion.newsdaily.newsTag.NewsTagRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService {
    private final TagRepo tagRepository;

    @Autowired
    private NewsTagRepo newsTagRepo;

    @Autowired
    public TagService(TagRepo tagRepository) {
        this.tagRepository = tagRepository;
    }

    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

    public Tag getTagById(long id) {
        return tagRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tag not found with id: " + id));
    }

    public String getTagNameById(long id) {
        return tagRepository.findTagNameById(id);
    }

    public Tag createTag(TagDTO tagDTO) {

        Tag tag = new Tag();
        tag.setName(tagDTO.getName());
        Tag myTag = tagRepository.save(tag);

        NewsTag newsTag = new NewsTag();
        newsTag.setNewsArticleId(tagDTO.getNewsId());
        newsTag.setTagId(myTag.getId());

        newsTagRepo.save(newsTag);

        return myTag;
    }

    public Tag updateTag(long id, TagDTO tagDTO) {
        Tag tag = getTagById(id);
        tag.setName(tagDTO.getName());
        Tag myTag = tagRepository.save(tag);
        return myTag;
    }

    public void deleteTag(long id) {
        Tag tag = getTagById(id);
        tagRepository.delete(tag);
    }
}

