package com.orion.newsdaily.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepo extends JpaRepository<User, Long> {

    Page<User> findByOrderByIdDesc(Pageable pageable);

    Page<User> findByUsernameLikeOrderByIdDesc(Pageable pageable, String name);

    User findByUsername(String username);
    @Query(value = "SELECT role FROM users WHERE username = ?1", nativeQuery = true)
    String getRoleByUsername(String username);

    @Query(value = "SELECT id FROM users WHERE username = ?1", nativeQuery = true)
    Long findIdByUserName(String userName);

}
