package jtag.internship_project.security;

import jtag.internship_project.entities.User;
import jtag.internship_project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private UserService userService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String path = request.getRequestURI();

		// Skip filter for registration and login
		if (path.startsWith("/api/users/register") || path.startsWith("/api/auth/login")) {
			filterChain.doFilter(request, response);
			return;
		}

		final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
		Long userId = null;

		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			if (jwtUtil.validateToken(token)) {
				userId = jwtUtil.extractUserId(token);
			}
		}

		if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			User user = userService.getUserById(userId);
			UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(user, null, null);
			SecurityContextHolder.getContext().setAuthentication(authToken);
		}

		filterChain.doFilter(request, response);
	}
}
