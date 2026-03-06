package com.ldap.ops.service;

import com.ldap.ops.common.vo.CurrentUserVO;
import com.ldap.ops.common.vo.LoginVO;
import com.ldap.ops.repository.SysUserRepository;
import com.ldap.ops.repository.entity.SysUser;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

/**
 * 认证服务：登录校验、当前用户（阶段二）
 */
@Service
public class AuthService {

    private final SysUserRepository sysUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(SysUserRepository sysUserRepository, PasswordEncoder passwordEncoder) {
        this.sysUserRepository = sysUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * 校验用户名密码，返回用户信息；失败返回 empty
     */
    public Optional<SysUser> validateUser(String username, String rawPassword) {
        return findActiveUser(username)
                .filter(u -> passwordEncoder.matches(rawPassword, u.getPassword()));
    }

    /**
     * 按用户名查找启用状态用户（用于 refresh/current，不校验密码）
     */
    public Optional<SysUser> findActiveUser(String username) {
        return sysUserRepository.findByUsername(username)
                .filter(u -> u.getStatus() != null && u.getStatus() == 1);
    }

    /**
     * 构建当前用户 VO（角色/权限阶段五从 DB 加载）
     */
    public CurrentUserVO toCurrentUserVO(SysUser user) {
        CurrentUserVO vo = new CurrentUserVO();
        vo.setId(user.getId());
        vo.setUsername(user.getUsername());
        vo.setRealName(user.getRealName());
        vo.setEmail(user.getEmail());
        vo.setLdapDn(user.getLdapDn());
        vo.setRoles(Collections.singletonList("ROLE_ADMIN"));
        vo.setPermissions(Collections.emptyList());
        return vo;
    }

    /**
     * 构建登录 VO 中的用户信息
     */
    public LoginVO.UserInfo toUserInfo(SysUser user) {
        LoginVO.UserInfo info = new LoginVO.UserInfo();
        info.setId(user.getId());
        info.setUsername(user.getUsername());
        info.setRealName(user.getRealName());
        info.setEmail(user.getEmail());
        info.setLdapDn(user.getLdapDn());
        info.setRoles(Collections.singletonList("ROLE_ADMIN"));
        info.setPermissions(Collections.emptyList());
        return info;
    }
}
