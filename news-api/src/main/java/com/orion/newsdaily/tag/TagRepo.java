package com.orion.newsdaily.tag;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface TagRepo extends JpaRepository<Tag, Long> {

    @Query(value = "SELECT name FROM tags WHERE id = ?1", nativeQuery = true)
    String findTagNameById(long id);
}
