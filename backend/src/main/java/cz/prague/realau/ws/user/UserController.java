package cz.prague.realau.ws.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cz.prague.realau.config.rest.support.ParamValidator;
import cz.prague.realau.config.rest.support.StdRestErrorException;

/**
 * Controller for initial user registration.
 *
 * @author Lukas Marek
 */
@RestController
@RequestMapping("api/user")
public class UserController {

    @Autowired
    private UserStorage storage;

    /**
     * Register user.
     * 
     * @param passHash password hash 
     * @param data additional user data
     * 
     * @return newly generated user id
     * 
     * @throws StdRestErrorException when passHash is null 
     */
    @PutMapping(path = "{passHash}")
    public int register(@PathVariable String passHash, String data) throws StdRestErrorException {
    	
    	ParamValidator.notNull(passHash, "passHash");

    	return storage.store(passHash, data);
    }

    /**
     * Validates password hash for a user.
     * 
	 * @param id user id
	 * @param passHash password hash
	 * 
	 * @return whether password hash is valid for that user
	 * 
     * @throws StdRestErrorException when passHash or id is null
     */
    @GetMapping(path = "{id}/{passHash}")
    public boolean validate(@PathVariable Integer id, @PathVariable String passHash) throws StdRestErrorException {
    	
    	ParamValidator.notNull(id, "id");
    	ParamValidator.notNull(passHash, "passHash");
    	
    	return storage.validate(id, passHash);
    }
}
