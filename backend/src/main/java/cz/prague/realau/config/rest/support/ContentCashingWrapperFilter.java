package cz.prague.realau.config.rest.support;

import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Caches all content read from the input stream and reader.
 */
public class ContentCashingWrapperFilter extends OncePerRequestFilter {

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		
		boolean firstRequest = !isAsyncDispatch(request);
		HttpServletRequest wrappedRequest = request;
		if (firstRequest && !(request instanceof ContentCachingRequestWrapper)) {
			// wrap request and cache its content
			wrappedRequest = new ContentCachingRequestWrapper(request);
		}
				
		filterChain.doFilter(wrappedRequest, response);
	}
}
