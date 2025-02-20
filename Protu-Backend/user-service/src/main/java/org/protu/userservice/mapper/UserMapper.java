package org.protu.userservice.mapper;

import com.github.f4b6a3.ulid.UlidCreator;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.protu.userservice.dto.request.SignUpReqDto;
import org.protu.userservice.dto.response.DeactivateResDto;
import org.protu.userservice.dto.response.UserResDto;
import org.protu.userservice.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserMapper {
  UserResDto toUserDto(User user);

  @Mapping(target = "authorities", constant = "ROLE_USER")
  @Mapping(target = "isActive", constant = "true")
  @Mapping(target = "isEmailVerified", constant = "false")
  @Mapping(target = "password", expression = "java(passwordEncoder.encode(signUpReqDto.password()))")
  @Mapping(target = "publicId", expression = "java(generateUlid())")
  User toUserEntity(SignUpReqDto signUpReqDto, @Context PasswordEncoder passwordEncoder);

  DeactivateResDto toDeactivateDto(User user);

  default String generateUlid(){
    return UlidCreator.getUlid().toString();
  }
}
