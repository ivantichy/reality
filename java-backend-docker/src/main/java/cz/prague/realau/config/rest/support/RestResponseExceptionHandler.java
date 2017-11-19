package cz.prague.realau.config.rest.support;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.WebUtils;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.time.Instant;

/**
 * Exception handler suppling additional information to each error report.
 */
@ControllerAdvice
public class RestResponseExceptionHandler extends ResponseEntityExceptionHandler {

	private static final Logger LOGGER = LogManager.getLogger();

        /**
         * Handles all exceptions in REST methods.
         *
         * @param e exception
         * @param httpRequest http request
         * @param request web request
         *
         * @return response
         */
	@ExceptionHandler({ Exception.class })
	@ResponseBody
	protected ResponseEntity<Object> handleRequest(Exception e, HttpServletRequest httpRequest, WebRequest request) {
		
		// AccessDeniedException shouldn't be handled
		if (e instanceof AccessDeniedException) {
			throw (AccessDeniedException) e;
		}

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		
		if(e instanceof StdRestErrorException) {
			return handleExceptionInternal(e, e.getMessage(), headers, ((StdRestErrorException) e).getStatus(), request);
		}

		String requestDetail = getRequestDetails(httpRequest);
		Long errorId = Long.valueOf(Instant.now().getEpochSecond());
		String msg = "Unexpected server error number " + errorId;
		LOGGER.error("Exception no {} in REST API detected. Request details: {}", errorId, requestDetail, e);
		
		return handleExceptionInternal(e, msg, headers, HttpStatus.INTERNAL_SERVER_ERROR, request);
	}
	
	private String getRequestDetails(HttpServletRequest request) {
		StringBuilder msg = new StringBuilder();
		
		// HTTP method and URI
		msg.append(request.getMethod());
		msg.append(" uri=").append(request.getRequestURL());

		// query string
		String queryString = request.getQueryString();
		if (queryString != null) {
			msg.append('?').append(queryString);
		}
		
		// remote IP address
		String client = request.getRemoteAddr();
		if (StringUtils.hasLength(client)) {
			msg.append(" client=").append(client);
		}
		
		// remote user name
		String user = request.getRemoteUser();
		if (user != null) {
			msg.append(" user=").append(user);
		}

		// request cached content
		ContentCachingRequestWrapper wrapper = WebUtils.getNativeRequest(request,
				ContentCachingRequestWrapper.class);
		if (wrapper != null) {
			byte[] buf = wrapper.getContentAsByteArray();
			if (buf.length > 0) {
				String payload;
				try {
					payload = new String(buf, 0, buf.length, wrapper.getCharacterEncoding());
				} catch (UnsupportedEncodingException ex) {
					payload = "[unknown]";
				}
				// Request payload
				msg.append(" payload=").append(payload);
			}
		}

		return msg.toString();
	}
}
