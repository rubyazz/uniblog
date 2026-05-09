package com.university.blog.service;

import com.university.blog.dto.TagDTO;
import com.university.blog.entity.Tag;
import com.university.blog.exception.BadRequestException;
import com.university.blog.exception.ResourceNotFoundException;
import com.university.blog.repository.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TagService {

    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    public List<TagDTO> getAllTags() {
        return tagRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public TagDTO createTag(TagDTO.CreateRequest request) {
        if (tagRepository.existsByName(request.getName())) {
            throw new BadRequestException("Tag already exists");
        }

        Tag tag = Tag.builder()
                .name(request.getName())
                .slug(request.getName().toLowerCase().replaceAll("[^a-z0-9\\s-]", "").replaceAll("\\s+", "-"))
                .build();

        tag = tagRepository.save(tag);
        return mapToDTO(tag);
    }

    public void deleteTag(Long id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found"));
        tagRepository.delete(tag);
    }

    private TagDTO mapToDTO(Tag tag) {
        return TagDTO.builder()
                .id(tag.getId())
                .name(tag.getName())
                .slug(tag.getSlug())
                .build();
    }
}
