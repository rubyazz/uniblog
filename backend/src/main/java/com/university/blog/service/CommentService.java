package com.university.blog.service;

import com.university.blog.dto.CommentDTO;
import com.university.blog.dto.PageResponse;
import com.university.blog.entity.Comment;
import com.university.blog.entity.Post;
import com.university.blog.entity.User;
import com.university.blog.exception.ResourceNotFoundException;
import com.university.blog.repository.CommentRepository;
import com.university.blog.repository.PostRepository;
import com.university.blog.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository,
                          PostRepository postRepository,
                          UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public PageResponse<CommentDTO> getCommentsByPost(Long postId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Comment> comments = commentRepository.findByPostIdAndApprovedTrue(postId, pageable);
        return mapPageToResponse(comments);
    }

    public CommentDTO createComment(Long postId, CommentDTO.CreateRequest request, String email) {
        User author = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        Comment.CommentBuilder builder = Comment.builder()
                .content(request.getContent())
                .post(post)
                .author(author)
                .approved(true);

        if (request.getParentId() != null) {
            Comment parent = commentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));
            builder.parent(parent);
        }

        Comment comment = commentRepository.save(builder.build());
        return mapToDTO(comment);
    }

    public void deleteComment(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        commentRepository.delete(comment);
    }

    public CommentDTO approveComment(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        comment.setApproved(true);
        comment = commentRepository.save(comment);
        return mapToDTO(comment);
    }

    public PageResponse<CommentDTO> getPendingComments(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Comment> comments = commentRepository.findByApprovedFalse(pageable);
        return mapPageToResponse(comments);
    }

    private PageResponse<CommentDTO> mapPageToResponse(Page<Comment> comments) {
        return PageResponse.<CommentDTO>builder()
                .content(comments.getContent().stream().map(this::mapToDTO).collect(Collectors.toList()))
                .pageNumber(comments.getNumber())
                .pageSize(comments.getSize())
                .totalElements(comments.getTotalElements())
                .totalPages(comments.getTotalPages())
                .first(comments.isFirst())
                .last(comments.isLast())
                .build();
    }

    private CommentDTO mapToDTO(Comment comment) {
        return CommentDTO.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .author(com.university.blog.dto.UserDTO.builder()
                        .id(comment.getAuthor().getId())
                        .username(comment.getAuthor().getUsername())
                        .firstName(comment.getAuthor().getFirstName())
                        .lastName(comment.getAuthor().getLastName())
                        .avatarUrl(comment.getAuthor().getAvatarUrl())
                        .build())
                .postId(comment.getPost().getId())
                .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
                .approved(comment.getApproved())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
