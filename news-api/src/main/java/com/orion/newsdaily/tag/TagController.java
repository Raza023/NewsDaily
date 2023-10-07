package com.orion.newsdaily.tag;

import com.orion.newsdaily.basic.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tags")
public class TagController {
    private final TagService tagService;

    @Autowired
    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public List<Tag> getAllTags() {
        List<Tag> tags = tagService.getAllTags();
        return tags;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Tag>> getTagById(@PathVariable long id) {
        Tag tag = tagService.getTagById(id);
        return ResponseEntity.ok(ApiResponse.of(tag));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Tag>> createTag(@RequestBody TagDTO tagDTO) {
        Tag createdTag = tagService.createTag(tagDTO);
        return ResponseEntity.ok(ApiResponse.of(createdTag));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Tag>> updateTag(@PathVariable long id, @RequestBody TagDTO tagDTO) {
        Tag updatedTag = tagService.updateTag(id, tagDTO);
        return ResponseEntity.ok(ApiResponse.of(updatedTag));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable long id) {
        tagService.deleteTag(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

