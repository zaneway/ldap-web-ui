package com.ldap.ops.common.constant;

/**
 * API 路径等常量
 */
public final class ApiConstants {

    public static final String API_V1_PREFIX = "/api/v1";
    public static final String AUTH_LOGIN = API_V1_PREFIX + "/auth/login";
    public static final String AUTH_REFRESH = API_V1_PREFIX + "/auth/refresh";
    public static final String AUTH_LOGOUT = API_V1_PREFIX + "/auth/logout";
    public static final String AUTH_CURRENT = API_V1_PREFIX + "/auth/current";

    public static final String HEADER_AUTHORIZATION = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";

    private ApiConstants() {
    }
}
