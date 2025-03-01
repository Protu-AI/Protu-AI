package org.protu.userservice.service;

import lombok.RequiredArgsConstructor;
import org.protu.userservice.config.AppPropertiesConfig;
import org.protu.userservice.constants.FailureMessages;
import org.protu.userservice.dto.request.ResetPasswordReqDto;
import org.protu.userservice.dto.request.SendOtpDto;
import org.protu.userservice.dto.request.SignInReqDto;
import org.protu.userservice.dto.request.SignUpReqDto;
import org.protu.userservice.dto.response.RefreshResDto;
import org.protu.userservice.dto.response.TokensResDto;
import org.protu.userservice.dto.response.signUpResDto;
import org.protu.userservice.exceptions.custom.EmailNotVerifiedException;
import org.protu.userservice.helper.UserHelper;
import org.protu.userservice.mapper.TokenMapper;
import org.protu.userservice.mapper.UserMapper;
import org.protu.userservice.model.User;
import org.protu.userservice.repository.UserRepository;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
  private final UserRepository userRepo;
  private final PasswordEncoder passwordEncoder;
  private final TokenMapper tokenMapper;
  private final UserMapper userMapper;
  private final JWTService jwtService;
  private final UserHelper userHelper;
  private final RedisTemplate<Object, Object> redisTemplate;
  private final OtpService otpService;
  private final AppPropertiesConfig properties;

  public signUpResDto signUpUser(SignUpReqDto signUpReqDto) {
    userHelper.checkIfUserExists(signUpReqDto.email(), "email");
    userHelper.checkIfUserExists(signUpReqDto.username(), "username");
    User user = userMapper.toUserEntity(signUpReqDto, passwordEncoder);
    otpService.sendOtp(5, properties.getOtp().getPrefix().getEmail() + user.getId(), user, properties.getOtp().getEmailTtl());
    userRepo.save(user);
    return new signUpResDto(user.getEmail(), true);
  }

  public void validateUserIdentifier(String userIdentifier) {
    User user = userHelper.fetchUserOrThrow(userIdentifier, "username/email");
    if (!user.getIsEmailVerified()) {
      otpService.sendOtp(5, properties.getOtp().getPrefix().getEmail() + user.getId(), user, properties.getOtp().getEmailTtl());
      throw new EmailNotVerifiedException(FailureMessages.EMAIL_NOT_VERIFIED.getMessage(userIdentifier));
    }
  }

  public TokensResDto signIn(SignInReqDto signInReqDto) {
    User user = userHelper.fetchUserOrThrow(signInReqDto.userIdentifier(), "username/email");
    if (!user.getIsEmailVerified()) {
      otpService.sendOtp(5, properties.getOtp().getPrefix().getEmail() + user.getId(), user, properties.getOtp().getEmailTtl());
      throw new EmailNotVerifiedException(FailureMessages.EMAIL_NOT_VERIFIED.getMessage(signInReqDto.userIdentifier()));
    }
    if (!passwordEncoder.matches(signInReqDto.password(), user.getPassword())) {
      throw new BadCredentialsException(FailureMessages.BAD_CREDENTIALS.getMessage("password"));
    }
    return tokenMapper.toTokensDto(user, jwtService);
  }

  public RefreshResDto refreshAccessToken(String refreshToken) {
    String authUserId = jwtService.getUserIdFromToken(refreshToken);
    return tokenMapper.toTokensDto(authUserId, jwtService);
  }

  public void forgotPassword(SendOtpDto requestDto) {
    Optional<User> userOpt = userHelper.findUserByIdentifier(requestDto.email(), Optional.of("email"));
    if(userOpt.isEmpty())
      return;
    User user = userOpt.get();
    otpService.sendOtp(5, properties.getOtp().getPrefix().getPassword() + user.getId(), user, properties.getOtp().getPasswordTtl());
  }

  public void resetPassword(ResetPasswordReqDto requestDto) {
    User user = userHelper.fetchUserOrThrow(requestDto.email(), "email");
    otpService.checkIfUserEnteredOtpValid(properties.getOtp().getPrefix().getPassword() + user.getId(), requestDto.OTP());
    redisTemplate.opsForValue().getAndDelete(properties.getOtp().getPrefix().getPassword() + user.getId());
    user.setPassword(passwordEncoder.encode(requestDto.password()));
    userRepo.save(user);
    jwtService.invalidateUserTokens(user.getId());
  }
}
