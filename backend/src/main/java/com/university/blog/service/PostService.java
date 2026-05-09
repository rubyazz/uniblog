package com.university.blog.service;

import com.university.blog.dto.CategoryDTO;
import com.university.blog.dto.PageResponse;
import com.university.blog.dto.PostDTO;
import com.university.blog.dto.TagDTO;
import com.university.blog.dto.UserDTO;
import com.university.blog.entity.Category;
import com.university.blog.entity.Post;
import com.university.blog.entity.Tag;
import com.university.blog.entity.User;
import com.university.blog.exception.BadRequestException;
import com.university.blog.exception.ResourceNotFoundException;
import com.university.blog.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final CommentRepository commentRepository;

    public PostService(PostRepository postRepository,
                       UserRepository userRepository,
                       CategoryRepository categoryRepository,
                       TagRepository tagRepository,
                       CommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
        this.commentRepository = commentRepository;
    }

    public PageResponse<PostDTO> getAllPosts(int page, int size, String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sort));
        Page<Post> posts = postRepository.findByStatus(Post.PostStatus.PUBLISHED, pageable);
        return mapPageToResponse(posts);
    }

    public PageResponse<PostDTO> searchPosts(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Post> posts = postRepository.searchPosts(query, Post.PostStatus.PUBLISHED, pageable);
        return mapPageToResponse(posts);
    }

    public PageResponse<PostDTO> getPostsByCategory(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Post> posts = postRepository.findByCategoryIdAndStatus(categoryId, Post.PostStatus.PUBLISHED, pageable);
        return mapPageToResponse(posts);
    }

    public PageResponse<PostDTO> getPostsByTag(Long tagId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Post> posts = postRepository.findByTagIdAndStatus(tagId, Post.PostStatus.PUBLISHED, pageable);
        return mapPageToResponse(posts);
    }

    public PageResponse<PostDTO> getFeaturedPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Post> posts = postRepository.findByFeaturedTrueAndStatus(Post.PostStatus.PUBLISHED, pageable);
        return mapPageToResponse(posts);
    }

    public PostDTO getPostBySlug(String slug) {
        Post post = postRepository.findBySlugAndStatus(slug, Post.PostStatus.PUBLISHED)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with slug: " + slug));
        post.setViewCount(post.getViewCount() + 1);
        postRepository.save(post);
        return mapToDTO(post);
    }

    public PostDTO getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
        return mapToDTO(post);
    }

    public PostDTO createPost(PostDTO.CreateRequest request, String email) {
        User author = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Post post = Post.builder()
                .title(request.getTitle())
                .slug(generateSlug(request.getTitle()))
                .content(request.getContent())
                .excerpt(request.getExcerpt())
                .imageUrl(request.getImageUrl())
                .status(Post.PostStatus.valueOf(request.getStatus() != null ? request.getStatus() : "DRAFT"))
                .author(author)
                .featured(request.getFeatured() != null ? request.getFeatured() : false)
                .build();

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            post.setCategory(category);
        }

        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            List<Tag> tags = tagRepository.findAllById(request.getTagIds());
            post.setTags(tags);
        }

        if (post.getStatus() == Post.PostStatus.PUBLISHED) {
            post.setPublishedAt(LocalDateTime.now());
        }

        post = postRepository.save(post);
        return mapToDTO(post);
    }

    public PostDTO updatePost(Long id, PostDTO.UpdateRequest request, String email) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (request.getTitle() != null) {
            post.setTitle(request.getTitle());
            post.setSlug(generateSlug(request.getTitle()));
        }
        if (request.getContent() != null) post.setContent(request.getContent());
        if (request.getExcerpt() != null) post.setExcerpt(request.getExcerpt());
        if (request.getImageUrl() != null) post.setImageUrl(request.getImageUrl());
        if (request.getStatus() != null) {
            Post.PostStatus newStatus = Post.PostStatus.valueOf(request.getStatus());
            if (newStatus == Post.PostStatus.PUBLISHED && post.getPublishedAt() == null) {
                post.setPublishedAt(LocalDateTime.now());
            }
            post.setStatus(newStatus);
        }
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            post.setCategory(category);
        }
        if (request.getFeatured() != null) post.setFeatured(request.getFeatured());
        if (request.getTagIds() != null) {
            List<Tag> tags = tagRepository.findAllById(request.getTagIds());
            post.setTags(tags);
        }

        post = postRepository.save(post);
        return mapToDTO(post);
    }

    public void deletePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        postRepository.delete(post);
    }

    public PageResponse<PostDTO> getPostsByAuthor(Long authorId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Post> posts = postRepository.findByAuthorId(authorId, pageable);
        return mapPageToResponse(posts);
    }

    public PostDTO toggleLike(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        post.setLikeCount(post.getLikeCount() + 1);
        post = postRepository.save(post);
        return mapToDTO(post);
    }

    public PageResponse<PostDTO> getAllPostsAdmin(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Post> posts = postRepository.findAll(pageable);
        return mapPageToResponse(posts);
    }

    private String generateSlug(String title) {
        return title.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                + "-" + System.currentTimeMillis() % 10000;
    }

    private PageResponse<PostDTO> mapPageToResponse(Page<Post> posts) {
        return PageResponse.<PostDTO>builder()
                .content(posts.getContent().stream().map(this::mapToDTO).collect(Collectors.toList()))
                .pageNumber(posts.getNumber())
                .pageSize(posts.getSize())
                .totalElements(posts.getTotalElements())
                .totalPages(posts.getTotalPages())
                .first(posts.isFirst())
                .last(posts.isLast())
                .build();
    }

    private PostDTO mapToDTO(Post post) {
        return PostDTO.builder()
                .id(post.getId())
                .title(post.getTitle())
                .slug(post.getSlug())
                .content(post.getContent())
                .excerpt(post.getExcerpt())
                .imageUrl(post.getImageUrl())
                .status(post.getStatus().name())
                .author(UserDTO.builder()
                        .id(post.getAuthor().getId())
                        .username(post.getAuthor().getUsername())
                        .firstName(post.getAuthor().getFirstName())
                        .lastName(post.getAuthor().getLastName())
                        .avatarUrl(post.getAuthor().getAvatarUrl())
                        .build())
                .category(post.getCategory() != null ? CategoryDTO.builder()
                        .id(post.getCategory().getId())
                        .name(post.getCategory().getName())
                        .slug(post.getCategory().getSlug())
                        .color(post.getCategory().getColor())
                        .build() : null)
                .tags(post.getTags().stream().map(tag -> TagDTO.builder()
                        .id(tag.getId())
                        .name(tag.getName())
                        .slug(tag.getSlug())
                        .build()).collect(Collectors.toList()))
                .viewCount(post.getViewCount())
                .likeCount(post.getLikeCount())
                .commentCount((int) commentRepository.countByPostId(post.getId()))
                .featured(post.getFeatured())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .publishedAt(post.getPublishedAt())
                .build();
    }
}
