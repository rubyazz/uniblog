-- V2__seed_data.sql

-- Insert admin user (password: admin123)
INSERT INTO users (username, email, password, first_name, last_name, bio, enabled)
VALUES ('admin', 'admin@university.edu', '$2a$12$LJ3m4ys3Lg2RqwmMpVr5kuYDFnGMHbOlcEHjPMYVHNwiMbEMwvoFW', 'Admin', 'User', 'Platform administrator', TRUE);
INSERT INTO user_roles (user_id, role) VALUES (1, 'ROLE_ADMIN');
INSERT INTO user_roles (user_id, role) VALUES (1, 'ROLE_USER');

-- Insert demo user (password: user123)
INSERT INTO users (username, email, password, first_name, last_name, bio, enabled)
VALUES ('john_doe', 'john@university.edu', '$2a$12$LJ3m4ys3Lg2RqwmMpVr5kuYDFnGMHbOlcEHjPMYVHNwiMbOEHjPMY', 'John', 'Doe', 'Computer Science student', TRUE);
INSERT INTO user_roles (user_id, role) VALUES (2, 'ROLE_USER');

-- Insert categories
INSERT INTO categories (name, slug, description, color, icon) VALUES
('Technology', 'technology', 'Tech news and tutorials', '#3B82F6', '💻'),
('Science', 'science', 'Scientific discoveries and research', '#10B981', '🔬'),
('Campus Life', 'campus-life', 'Student life and events', '#F59E0B', '🎓'),
('Opinions', 'opinions', 'Student opinions and editorials', '#EF4444', '💬'),
('Sports', 'sports', 'University sports news', '#8B5CF6', '⚽');

-- Insert tags
INSERT INTO tags (name, slug) VALUES
('Java', 'java'),
('Spring Boot', 'spring-boot'),
('React', 'react'),
('AI', 'ai'),
('Machine Learning', 'machine-learning'),
('Web Development', 'web-development'),
('Student Tips', 'student-tips');

-- Insert sample posts
INSERT INTO posts (title, slug, content, excerpt, image_url, status, author_id, category_id, view_count, like_count, featured, published_at)
VALUES
('Getting Started with Spring Boot 3', 'getting-started-spring-boot-3',
'<h2>Introduction to Spring Boot 3</h2><p>Spring Boot 3 brings a host of new features including native compilation support, Jakarta EE 10, and improved observability.</p><h3>Key Features</h3><ul><li><strong>Native Compilation</strong> - GraalVM support out of the box</li><li><strong>Jakarta EE 10</strong> - Migration from javax to jakarta namespace</li><li><strong>Virtual Threads</strong> - Project Loom integration</li></ul><p>In this tutorial, we will walk through setting up a new Spring Boot 3 project from scratch.</p>',
'Learn how to build modern Java applications with Spring Boot 3',
'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
'PUBLISHED', 1, 1, 245, 42, TRUE, NOW() - INTERVAL '5 days'),

('The Future of AI in Education', 'future-ai-education',
'<h2>AI Transforming Education</h2><p>Artificial Intelligence is reshaping how we learn and teach at universities worldwide.</p><p>From personalized learning paths to automated grading systems, AI tools are becoming an integral part of the modern educational experience.</p><h3>Current Applications</h3><ul><li>Intelligent tutoring systems</li><li>Automated essay scoring</li><li>Personalized content recommendations</li><li>Language learning assistants</li></ul>',
'Exploring how artificial intelligence is transforming the educational landscape',
'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
'PUBLISHED', 1, 2, 189, 35, TRUE, NOW() - INTERVAL '3 days'),

('Top 10 Study Tips for Final Exams', 'top-10-study-tips',
'<h2>Master Your Finals</h2><p>Final exams are approaching, and we have compiled the best study strategies from top students and professors.</p><ol><li><strong>Start Early</strong> - Begin reviewing at least 2 weeks before exams</li><li><strong>Active Recall</strong> - Test yourself instead of re-reading</li><li><strong>Spaced Repetition</strong> - Review material at increasing intervals</li><li><strong>The Pomodoro Technique</strong> - 25 min study, 5 min break</li><li><strong>Study Groups</strong> - Collaborate with classmates</li></ol>',
'The ultimate guide to acing your final exams this semester',
'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
'PUBLISHED', 1, 3, 512, 87, TRUE, NOW() - INTERVAL '1 day'),

('Building a REST API with React Frontend', 'rest-api-react-frontend',
'<h2>Full Stack Development</h2><p>Learn how to create a complete full-stack application with a Spring Boot REST API and React frontend.</p><p>This guide covers everything from setting up your backend to creating beautiful UI components.</p>',
'A comprehensive guide to full-stack development with modern tools',
'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
'PUBLISHED', 1, 1, 156, 28, FALSE, NOW() - INTERVAL '2 days');

-- Insert tags for posts
INSERT INTO post_tags (post_id, tag_id) VALUES
(1, 1), (1, 2), (1, 6),
(2, 4), (2, 5),
(3, 7),
(4, 2), (4, 3), (4, 6);

-- Insert sample comments
INSERT INTO comments (content, post_id, author_id, approved, created_at)
VALUES
('Great tutorial! Really helped me understand Spring Boot 3 better.', 1, 2, TRUE, NOW() - INTERVAL '4 days'),
('The section on native compilation was particularly useful. Thanks!', 1, 2, TRUE, NOW() - INTERVAL '3 days'),
('This is exactly what I needed for my finals preparation. Bookmarking this!', 3, 2, TRUE, NOW() - INTERVAL '12 hours');
