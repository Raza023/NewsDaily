package com.orion.newsdaily.comment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@Data
@AllArgsConstructor
public class CommentDTO {
    private List<Long> commentId;
    private List<String> username;
    private List<Comment> comments;
}
