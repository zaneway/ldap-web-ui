package com.ldap.ops.repository.entity;

import lombok.Data;

import javax.persistence.*;

/**
 * 角色实体（阶段二建表，阶段五完善使用）
 */
@Data
@Entity
@Table(name = "sys_role")
public class SysRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "role_code", nullable = false, unique = true, length = 50)
    private String roleCode;

    @Column(name = "role_name", nullable = false, length = 100)
    private String roleName;

    @Column(length = 500)
    private String description;

    private Integer status = 1;
}
