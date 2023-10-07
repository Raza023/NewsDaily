package com.orion.newsdaily.comment;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Comment> create(Authentication auth, @RequestParam Long newsId, @RequestBody Comment comment) {
        Comment created = commentService.create(auth.getName(), newsId, comment);
        if (created != null) {
            return ResponseEntity.ok(created);
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    @GetMapping("/{newsId}/all")
    public ResponseEntity<CommentDTO> NewsSpecificComments(@PathVariable("newsId") Long id) {

        return ResponseEntity.ok(commentService.NewsSpecificCommentsWithAuthor(id));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAuthority('EDITOR')")
    public ResponseEntity<List<Comment>> findPendingComments() {
        return ResponseEntity.ok(commentService.findPendingComments());
    }

    @GetMapping
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<List<Comment>> findAll() {
        List<Comment> comments = commentService.findAll();
        return ResponseEntity.ok(comments);

    }

    @GetMapping("/editor")
    @PreAuthorize("hasAuthority('EDITOR')")
    public ResponseEntity<List<Comment>> findAllCommentsForEditor() {
        List<Comment> comments = commentService.findAllCommentsForEditor();
        return ResponseEntity.ok(comments);

    }

    @PreAuthorize("hasAuthority('EDITOR')")
    @PutMapping("/approve/{id}")
    public ResponseEntity<Comment> approveCommentToggle(@PathVariable("id") long id) {
        Comment updated = commentService.approveCommentToggle(id);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasAuthority('EDITOR')")
    @PutMapping("/disable/{id}")
    public ResponseEntity<Comment> disableCommentToggle(@PathVariable("id") long id) {
        Comment updated = commentService.disableCommentToggle(id);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('EDITOR', 'USER')")
    public ResponseEntity<Comment> delete(@PathVariable("id") Long id) {
        Comment comment = commentService.findById(id);
        commentService.delete(comment);
        return ResponseEntity.ok(comment);
    }

    @GetMapping("/user-pending-comments")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<List<Comment>> findUserPendingComments(Authentication auth) {
        List<Comment> comments = commentService.findUserPendingComments(auth.getName());
        return ResponseEntity.ok(comments);
    }
}
