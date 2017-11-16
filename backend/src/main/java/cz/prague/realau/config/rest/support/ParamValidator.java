package cz.prague.realau.config.rest.support;

/**
 * Helper class that helps with param validation.
 * 
 * @author Lukas Marek
 */
public final class ParamValidator {

	private ParamValidator() {
		// forbid instantiation
	}
	
	/**
	 * Validates weather parameter is null and throws {@link StdRestErrorException} if it is.
	 * 
	 * @param param parameter to test
	 * @param paramName parameter name (for error message)
	 * 
	 * @throws StdRestErrorException if parameter is null
	 */
	public static void notNull(Object param, String paramName) throws StdRestErrorException {
		
		if(param == null) {
			throw new StdRestErrorException("Param " + paramName  + " cannot be null (empty)");
		}
	}
}
