package com.ldap.ops.api;

import com.ldap.ops.common.constant.ApiConstants;
import com.ldap.ops.common.dto.LoginDTO;
import com.ldap.ops.common.result.ApiResult;
import com.ldap.ops.common.vo.CurrentUserVO;
import com.ldap.ops.common.vo.LoginVO;
import com.ldap.ops.security.JwtTokenProvider;
import com.ldap.ops.service.AuthService;
import com.ldap.ops.repository.entity.SysUser;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * 认证接口：登录、刷新、当前用户、登出
 */
@Api(tags = "认证")
@RestController
@RequestMapping(ApiConstants.API_V1_PREFIX + "/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(AuthService authService, JwtTokenProvider jwtTokenProvider) {
        this.authService = authService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @ApiOperation("登录")
    @PostMapping("/login")
    public ResponseEntity<ApiResult<LoginVO>> login(@Validated @RequestBody LoginDTO dto) {
        Optional<SysUser> userOpt = authService.validateUser(dto.getUsername(), dto.getPassword());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(ApiResult.fail(401, "用户名或密码错误"));
        }
        SysUser user = userOpt.get();
        List<String> roles = List.of("ROLE_ADMIN");
        String accessToken = jwtTokenProvider.generateAccessToken(user.getUsername(), roles);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getUsername());
        LoginVO vo = LoginVO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtTokenProvider.getAccessTokenExpireSeconds())
                .user(authService.toUserInfo(user))
                .build();
        return ResponseEntity.ok(ApiResult.ok(vo));
    }

    @ApiOperation("刷新 Token")
    @PostMapping("/refresh")
    public ResponseEntity<ApiResult<LoginVO>> refresh(@RequestBody(required = false) RefreshRequest request) {
        String refreshToken = request != null ? request.getRefreshToken() : null;
        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.status(401).body(ApiResult.fail(401, "缺少 refreshToken"));
        }
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            return ResponseEntity.status(401).body(ApiResult.fail(401, "refreshToken 无效或已过期"));
        }
        String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
        Optional<SysUser> userOpt = authService.findActiveUser(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(ApiResult.fail(401, "用户不存在或已禁用"));
        }
        SysUser user = userOpt.get();
        List<String> roles = List.of("ROLE_ADMIN");
        String newAccess = jwtTokenProvider.generateAccessToken(user.getUsername(), roles);
        String newRefresh = jwtTokenProvider.generateRefreshToken(username);
        LoginVO vo = LoginVO.builder()
                .accessToken(newAccess)
                .refreshToken(newRefresh)
                .expiresIn(jwtTokenProvider.getAccessTokenExpireSeconds())
                .user(authService.toUserInfo(user))
                .build();
        return ResponseEntity.ok(ApiResult.ok(vo));
    }

    @ApiOperation("获取当前用户")
    @GetMapping("/current")
    public ResponseEntity<ApiResult<CurrentUserVO>> current(@AuthenticationPrincipal String username) {
        if (username == null || username.isBlank()) {
            return ResponseEntity.status(401).body(ApiResult.fail(401, "未登录"));
        }
        return authService.findActiveUser(username)
                .map(u -> ResponseEntity.ok(ApiResult.ok(authService.toCurrentUserVO(u))))
                .orElseGet(() -> ResponseEntity.status(401).body(ApiResult.fail(401, "用户不存在或已禁用")));
    }

    @ApiOperation("登出")
    @PostMapping("/logout")
    public ResponseEntity<ApiResult<Void>> logout() {
        return ResponseEntity.ok(ApiResult.ok());
    }

    @lombok.Data
    public static class RefreshRequest {
        private String refreshToken;
    }
}
