package com.ldap.ops;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * LDAP 运维管理系统 - 应用启动类
 */
@SpringBootApplication(scanBasePackages = "com.ldap.ops")
@EntityScan("com.ldap.ops.repository.entity")
@EnableJpaRepositories("com.ldap.ops.repository")
public class LdapWebUiApplication {

    public static void main(String[] args) {
        SpringApplication.run(LdapWebUiApplication.class, args);
    }
}
