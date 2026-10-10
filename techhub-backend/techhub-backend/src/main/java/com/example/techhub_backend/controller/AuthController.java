package com.example.techhub_backend.controller;

import java.util.Map;
import java.util.regex.Pattern;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.techhub_backend.dto.AuthRequest;
import com.example.techhub_backend.dto.AuthResponse;
import com.example.techhub_backend.dto.RegisterRequest;
import com.example.techhub_backend.model.Role;
import com.example.techhub_backend.model.User;
import com.example.techhub_backend.repository.UserRepository;
import com.example.techhub_backend.security.JwtUtils;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtUtils jwtUtils,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        if (request.getName() == null ||
                request.getName().trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Name cannot be empty");
        }

        if (request.getEmail() == null ||
                request.getEmail().trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Email cannot be empty");
        }

        // Same clean-up used when saving, so the duplicate check
        // does not depend on the database's case rules.
        String email = request.getEmail().trim().toLowerCase();

        if (!EMAIL_PATTERN.matcher(email).matches()) {

            return ResponseEntity.badRequest()
                    .body("Please enter a valid email address");
        }

        if (request.getPassword() == null ||
                request.getPassword().length() < 6) {

            return ResponseEntity.badRequest()
                    .body("Password must contain at least 6 characters");
        }

        if (userRepository.existsByEmail(email)) {

            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email is already registered");
        }

        User user = new User(
                request.getName().trim(),
                email,
                passwordEncoder.encode(request.getPassword()),
                Role.USER
        );

        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Customer account created successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody AuthRequest request) {

        if (request.getEmail() == null ||
                request.getEmail().trim().isEmpty() ||
                request.getPassword() == null ||
                request.getPassword().isEmpty()) {

            return ResponseEntity.badRequest().body(
                    Map.of("error", "Email and password are required")
            );
        }

        String email = request.getEmail().trim().toLowerCase();

        // Wrong credentials throw BadCredentialsException, which
        // GlobalExceptionHandler turns into a 401 response.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email,
                        request.getPassword()
                )
        );

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new BadCredentialsException(
                                "Invalid email or password"
                        )
                );

        String token = jwtUtils.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        AuthResponse response = new AuthResponse(
                token,
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );

        return ResponseEntity.ok(response);
    }
}
