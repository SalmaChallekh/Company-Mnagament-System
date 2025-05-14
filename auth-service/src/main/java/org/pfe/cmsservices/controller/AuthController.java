package org.pfe.cmsservices.controller;

import jakarta.persistence.EntityExistsException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.pfe.cmsservices.dto.ApiResponse;
import org.pfe.cmsservices.dto.AuthResponse;
import org.pfe.cmsservices.dto.LoginRequest;
import org.pfe.cmsservices.dto.RegisterRequest;
import org.pfe.cmsservices.entity.User;

import org.pfe.cmsservices.security.CustomUserDetails;
import org.pfe.cmsservices.security.CustomUserDetailsService;
import org.pfe.cmsservices.service.UserService;
import org.pfe.cmsservices.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
   // private final JwtTokenProvider jwtTokenProvider;
    @Autowired
    public AuthController(UserService userService, JwtUtil jwtUtil,
                          AuthenticationManager authenticationManager, CustomUserDetailsService userDetailsService) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody @Valid RegisterRequest registerRequest) {
        try {
            User user = userService.registerUser(
                    registerRequest.getUsername(),
                    registerRequest.getEmail(),
                    registerRequest.getPassword(),
                    registerRequest.getRole()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully!");
        } catch (EntityExistsException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }
    @GetMapping("/activate")
    public ResponseEntity<String> testActivate(@RequestParam String token) {
        try {
            // Call to user service to complete registration with the given token and temp password
            userService.completeRegistration(token, "Test1234!"); // temp password
            return ResponseEntity.ok("Activated with temp password!");
        } catch (Exception e) {
            // Handle any errors, such as invalid token or other exceptions
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error during activation: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody @Valid LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(), loginRequest.getPassword())
            );

            CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = customUserDetails.getUser();

            String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
            return ResponseEntity.ok(new AuthResponse(token));

        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, "Invalid username or password"));
        }
    }
    @PostMapping("/complete-registration")
    public ResponseEntity<?> completeRegistration(
            @RequestBody @Valid CompleteRegistrationRequest request) {

        userService.completeRegistration(request.token(), request.password());
        return ResponseEntity.ok("Password set successfully. You can now login.");
    }

    public record CompleteRegistrationRequest(
            @NotBlank String token,
            @NotBlank @Size(min = 8) String password
    ) {}
}


