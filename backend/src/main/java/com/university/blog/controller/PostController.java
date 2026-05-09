package com.university.blog.controller;

import com.university.blog.dto.PageResponse;
import com.university.blog.dto.PostDTO;
import com.university.blog.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/posts")
@Tag(name = "Posts", description = "Post management APIs")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    @Operation(summary = "Get all published posts", description = "Retrieve paginated list of published posts")
    public ResponseEntity<PageResponse<PostDTO>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort) {
        return ResponseEntity.ok(postService.getAllPosts(page, size, sort));
    }

    @GetMapping("/search")
    @Operation(summary = "Search posts")
    public ResponseEntity<PageResponse<PostDTO>> searchPosts(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(postService.searchPosts(query, page, size));
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get posts by category")
    public ResponseEntity<PageResponse<PostDTO>> getPostsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(postService.getPostsByCategory(categoryId, page, size));
    }

    @GetMapping("/tag/{tagId}")
    @Operation(summary = "Get posts by tag")
    public ResponseEntity<PageResponse<PostDTO>> getPostsByTag(
            @PathVariable Long tagId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(postService.getPostsByTag(tagId, page, size));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured posts")
    public ResponseEntity<PageResponse<PostDTO>> getFeaturedPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(postService.getFeaturedPosts(page, size));
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get post by slug")
    public ResponseEntity<PostDTO> getPostBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(postService.getPostBySlug(slug));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get post by ID")
    public ResponseEntity<PostDTO> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @PostMapping
    @Operation(summary = "Create a new post")
    public ResponseEntity<PostDTO> createPost(
            @Valid @RequestBody PostDTO.CreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(postService.createPost(request, userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a post")
    public ResponseEntity<PostDTO> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody PostDTO.UpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(postService.updatePost(id, request, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    @Operation(summary = "Delete a post")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/like")
    @Operation(summary = "Like a post")
    public ResponseEntity<PostDTO> toggleLike(@PathVariable Long id) {
        return ResponseEntity.ok(postService.toggleLike(id));
    }

    @GetMapping("/author/{authorId}")
    @Operation(summary = "Get posts by author")
    public ResponseEntity<PageResponse<PostDTO>> getPostsByAuthor(
            @PathVariable Long authorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(postService.getPostsByAuthor(authorId, page, size));
    }
}
