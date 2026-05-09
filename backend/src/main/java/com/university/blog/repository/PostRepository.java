package com.university.blog.repository;

import com.university.blog.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findByStatus(Post.PostStatus status, Pageable pageable);

    Page<Post> findByAuthorId(Long authorId, Pageable pageable);

    Page<Post> findByCategoryIdAndStatus(Long categoryId, Post.PostStatus status, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.status = :status AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.content) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Post> searchPosts(@Param("search") String search, @Param("status") Post.PostStatus status, Pageable pageable);

    @Query("SELECT p FROM Post p LEFT JOIN p.tags t WHERE t.id = :tagId AND p.status = :status")
    Page<Post> findByTagIdAndStatus(@Param("tagId") Long tagId, @Param("status") Post.PostStatus status, Pageable pageable);

    Page<Post> findByFeaturedTrueAndStatus(Post.PostStatus status, Pageable pageable);

    Optional<Post> findBySlugAndStatus(String slug, Post.PostStatus status);

    @Query("SELECT COUNT(p) FROM Post p WHERE p.author.id = :authorId")
    long countByAuthorId(@Param("authorId") Long authorId);
}
