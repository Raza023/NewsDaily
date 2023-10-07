package com.orion.newsdaily.user;

import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    private final Logger logger = LoggerFactory.getLogger(getClass());


    @Value("${news.page.min:0}")
    public int pageMin = 0;

    @Value("${news.page.size.min:1}")
    public int pageSizeMin = 1;

    @Value("${news.page.size.max:100}")
    public int pageSizeMax = 100;


    final UserRepo userRepo;

    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public UserDetails loadUserByUsername(String jti, String username) throws UsernameNotFoundException {
        return loadUserByUsername(username);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepo.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("Invalid user: " + username);
        }
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), true,
                true, true, true, AuthorityUtils.commaSeparatedStringToAuthorityList(user.getRole()));
    }

    public List<User> findAll() {
        return userRepo.findAll();
    }

    public Optional<User> findById(Long id) {
        Optional<User> acc = userRepo.findById(id);
        if (acc.isPresent())
        {
            return acc;
        }
        return null;
    }

    public List<User> findAllByName(int page, int size, String title) {

        if (page < pageMin) {
            page = pageMin;
        }
        if (size > pageSizeMax) {
            size = pageSizeMax;
        } else if (size < pageSizeMin) {
            size = pageSizeMin;
        }
        logger.debug("News search with page: {}, size: {}, title: {}", page, size, title.replaceAll("[\r\n]", ""));   //log forgery
        Pageable pageable = PageRequest.of(page, size);
        if (title.isEmpty() || title.isBlank()) {
            return  userRepo.findByOrderByIdDesc(pageable).getContent();
        }
        return userRepo.findByUsernameLikeOrderByIdDesc(pageable, title).getContent();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Transactional
    public User create(User user) {
        Long userId = user.getId();
        if(userId != null && userRepo.existsById(userId)) {
            return null;
        }
        user.setPassword(passwordEncoder().encode(user.getPassword()));
        user.setIsDisabled(false);
        return userRepo.save(user);
    }

    @Transactional
    public User update(User updatedUser, Long id) {

        Optional<User> existingUserOptional = userRepo.findById(id);

        logger.debug("check this.");

        if (existingUserOptional.isEmpty()) {
            logger.trace("There is nothing to update with id = {}",id);
            return null;
        }


        User existingUser = existingUserOptional.get();

        existingUser.setUsername(updatedUser.getUsername());
        existingUser.setPassword(updatedUser.getPassword());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setRole(existingUser.getRole());


        userRepo.save(existingUser);

        return existingUser;
    }

    public User findByUserName(String username){
        return userRepo.findByUsername(username);
    }
    public boolean delete(Long id)
    {

        Optional<User> user = userRepo.findById(id);
        if(user.isPresent())
        {
            userRepo.delete(user.get());
            return true;
        }
        return false;
    }

    public Authentication getAuth()
    {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        return auth;
    }

    public String getRoleByUsername(String username) {
        return userRepo.getRoleByUsername(username);
    }
    public Long findIdByUserName(String userName)
    {
        return userRepo.findIdByUserName(userName);
    }

    @Transactional
    public User disableUserToggle(long userId) {
        Optional<User> user = userRepo.findById(userId);
        if (user.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        User userToUpdate = user.get();
        if(userToUpdate.getIsDisabled().equals(Boolean.FALSE)){
            userToUpdate.setIsDisabled(true);
        } else if (userToUpdate.getIsDisabled().equals(Boolean.TRUE)) {
            userToUpdate.setIsDisabled(false);
        }
        userRepo.save(userToUpdate);
        return userToUpdate;
    }
}
