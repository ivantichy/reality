package cz.prague.realau.config.rest.support;

import org.springframework.http.HttpStatus;

/**
 * Generic REST error response with custom HTTP error code.
 *
 * @author Lukas Marek
 */
public class StdRestErrorException extends Exception {

    private static final long serialVersionUID = 8608304802607627903L;

    private final HttpStatus status;

    /**
     * Create new rest error response.
     *
     * @param message error response message
     */
    public StdRestErrorException(String message) {
        this(message, HttpStatus.BAD_REQUEST);
    }

    /**
     * Create new rest error response.
     *
     * @param message error response message
     * @param status custom status code
     */
    public StdRestErrorException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    /**
     * Returns HTTP status code of the error response.
     *
     * @return HTTP status code of the error response
     */
    public HttpStatus getStatus() {
        return status;
    }
}
