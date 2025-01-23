package com.pharmasight.service;

import com.pharmasight.exceptions.UserNotFoundException;
import com.pharmasight.model.UserPrincipal;
import com.pharmasight.model.User;
import com.pharmasight.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MyUserDetailsService implements UserDetailsService {

    private final UserRepo repo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UserNotFoundException {
        User user = repo.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));

        return new UserPrincipal(user);
    }

}
