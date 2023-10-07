package com.orion.newsdaily.user;


import com.orion.newsdaily.basic.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<User>> findAll() {
        return ResponseEntity.ok((userService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Optional<User>>> findById(@PathVariable("id") Long id) {
        Optional<User> user = userService.findById(id);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ApiResponse.of(user));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<User>>> findAllByName(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "100") int size,
            @RequestParam(name = "title", defaultValue = "") String title) {
        List<User> news = userService.findAllByName(page, size, "%" + title + "%");
        if (news.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ApiResponse.of(news));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','EDITOR', 'USER', 'REPORTER')")
    @GetMapping("/user")
    public ResponseEntity<ApiResponse<User>> findUserByUsername(Authentication auth) {
        String username=" ";
        if(auth==null || auth.getPrincipal()==null){

            username="anonymous";

        }
        else {
            username = auth.getName();
        }
        User user = userService.findByUserName(username);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ApiResponse.of(user));
    }



    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','EDITOR')")
    public ResponseEntity<ApiResponse<User>> create(@RequestBody User accToInsert) {
        User createdAcc = userService.create(accToInsert);
        if (createdAcc != null) {
            return ResponseEntity.ok(ApiResponse.of(createdAcc));
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    @PostMapping("/signup")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponse<User>> signup(@RequestBody User accToInsert) {
        User createdAcc = userService.create(accToInsert);
        if (createdAcc != null) {
            return ResponseEntity.ok(ApiResponse.of(createdAcc));
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN','EDITOR')")
    public ResponseEntity<ApiResponse<User>> update(@RequestBody User updatedAccount, @PathVariable("id") Long id) {
        User updated = userService.update(updatedAccount, id);   //to save on db as well

        if (updated != null) {
            return ResponseEntity.ok(ApiResponse.of(updated));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasAnyAuthority('ADMIN','EDITOR')")
    public ResponseEntity<ApiResponse<List<User>>> delete(@PathVariable("userId") Long id) {
        userService.delete(id);
        List<User> list = userService.findAll();
        return ResponseEntity.ok(ApiResponse.of(list));
    }

    @GetMapping("/getAuthenticatedUser")
    public Authentication getAuthenticatedUser() {
        Authentication authenticationUser = SecurityContextHolder.getContext().getAuthentication();
        return authenticationUser;
    }
    @GetMapping("/getUserId")
    public long getUserId(Authentication auth) {
        String userName = auth.getName();
        return(userService.findIdByUserName(userName));
    }

    @PreAuthorize("hasAuthority('EDITOR')")
    @PutMapping("/disable/{userId}")
    public ResponseEntity<User> disableUserToggle(@PathVariable("userId") long id) {
        User updated = userService.disableUserToggle(id);
        if (updated==null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }


}