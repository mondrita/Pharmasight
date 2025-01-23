package com.pharmasight.service;

import com.pharmasight.dto.UserLoginDTO;
import com.pharmasight.model.User;
import com.pharmasight.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepo repo;

    private final JWTService jwtService;

    @Autowired
    AuthenticationManager authManager;

    @Value("${password}")
    private String password;


    private BCryptPasswordEncoder encoder=new BCryptPasswordEncoder(12);

    public User register (User user){
        user.setPassword(encoder.encode(user.getPassword()));
        return repo.save(user);
    }

    public String verify(UserLoginDTO loginDTO) {
        Authentication authentication =
                authManager.authenticate(new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword()));

        if (authentication.isAuthenticated())
            return jwtService.generateToken(loginDTO.getUsername());

        return "Fail";
    }
}
