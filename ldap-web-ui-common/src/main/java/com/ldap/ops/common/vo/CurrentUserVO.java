package com.ldap.ops.common.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 当前用户信息 VO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CurrentUserVO {

    private Long id;
    private String username;
    private String realName;
    private String email;
    private String ldapDn;
    private List<String> roles;
    private List<String> permissions;
}
