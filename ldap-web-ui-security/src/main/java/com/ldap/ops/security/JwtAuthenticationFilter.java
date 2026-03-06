package com.ldap.ops.security;

import com.ldap.ops.common.constant.ApiConstants;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import java.util.stream.Collectors;

/**
 * JWT 认证过滤器：从请求头解析 Token 并设置安全上下文
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String token = resolveToken(request);
            if (StringUtils.hasText(token) && jwtTokenProvider.validateToken(token)) {
                String username = jwtTokenProvider.getUsernameFromToken(token);
                var roles = jwtTokenProvider.getRolesFromToken(token).stream()
                        .map(r -> new SimpleGrantedAuthority("ROLE_" + r.replaceFirst("^ROLE_", "")))
                        .collect(Collectors.toList());
                var auth = new UsernamePasswordAuthenticationToken(username, null, roles);
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        } catch (Exception ignored) {
            // 无效 token 不设置上下文，后续会 401
        }
        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearer = request.getHeader(ApiConstants.HEADER_AUTHORIZATION);
        if (StringUtils.hasText(bearer) && bearer.startsWith(ApiConstants.BEARER_PREFIX)) {
            return bearer.substring(ApiConstants.BEARER_PREFIX.length()).trim();
        }
        return null;
    }
}
