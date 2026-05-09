package com.university.blog.controller;

import com.university.blog.dto.PageResponse;
import com.university.blog.dto.PostDTO;
import com.university.blog.dto.CommentDTO;
import com.university.blog.dto.UserDTO;
import com.university.blog.service.AdminService;
import com.university.blog.service.CommentService;
import com.university.blog.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin management APIs")
public class AdminController {

    private final AdminService adminService;
    private final PostService postService;
    private final CommentService commentService;

    public AdminController(AdminService adminService, PostService postService, CommentService commentService) {
        this.adminService = adminService;
        this.postService = postService;
        this.commentService = commentService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get dashboard statistics")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}/toggle")
    @Operation(summary = "Enable/disable user")
    public ResponseEntity<UserDTO> toggleUserEnabled(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleUserEnabled(id));
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete user")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/posts")
    @Operation(summary = "Get all posts (admin view)")
    public ResponseEntity<PageResponse<PostDTO>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(postService.getAllPostsAdmin(page, size));
    }

    @GetMapping("/comments/pending")
    @Operation(summary = "Get pending comments")
    public ResponseEntity<PageResponse<CommentDTO>> getPendingComments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(commentService.getPendingComments(page, size));
    }
}
