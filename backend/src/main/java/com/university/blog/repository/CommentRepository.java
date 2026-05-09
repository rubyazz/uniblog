package com.university.blog.repository;

import com.university.blog.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByPostIdAndApprovedTrue(Long postId, Pageable pageable);
    Page<Comment> findByApprovedFalse(Pageable pageable);
    long countByPostId(Long postId);
    long countByApprovedFalse();
}
