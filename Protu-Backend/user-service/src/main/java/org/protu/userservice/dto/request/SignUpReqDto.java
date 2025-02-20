package org.protu.userservice.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignUpReqDto (
  @NotBlank(message = "First name is required")
  @Size(max = 50, message = "First name must not exceed 50 characters")
  String firstName,
  @NotBlank(message = "Last name is required")
  @Size(max = 50, message = "Last name must not exceed 50 characters")
  String lastName,

  @NotBlank(message = "Username is required")
  @Size(max = 50, message = "Username must not exceed 50 characters")
  String username,

  @NotBlank(message = "Email is required")
  @Email(message = "Invalid email format")
  @Size(max = 100, message = "Email must not exceed 100 characters")
  String email,

  @NotBlank(message = "Password is required")
  @Size(min = 8, message = "Password must be at least 8 characters long")
  String password,

  @NotBlank(message = "Phone number is required")
  @Size(max = 20, message = "Phone number must not exceed 20 characters")
  String phoneNumber
){}
