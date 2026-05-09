package com.university.blog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDTO {
    private Long id;
    private String title;
    private String slug;
    private String content;
    private String excerpt;
    private String imageUrl;
    private String status;
    private UserDTO author;
    private CategoryDTO category;
    private List<TagDTO> tags;
    private Integer viewCount;
    private Integer likeCount;
    private Integer commentCount;
    private Boolean featured;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {
        @NotBlank(message = "Title is required")
        @Size(min = 3, max = 255)
        private String title;

        @NotBlank(message = "Content is required")
        private String content;

        private String excerpt;
        private String imageUrl;
        private String status;
        private Long categoryId;
        private List<Long> tagIds;
        private Boolean featured;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateRequest {
        @Size(min = 3, max = 255)
        private String title;
        private String content;
        private String excerpt;
        private String imageUrl;
        private String status;
        private Long categoryId;
        private List<Long> tagIds;
        private Boolean featured;
    }
}
