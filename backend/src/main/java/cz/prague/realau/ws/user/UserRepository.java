package cz.prague.realau.ws.user;

import org.springframework.data.repository.CrudRepository;

/**
 * User repository.
 *
 * @author Lukas Marek
 */
interface UserRepository extends CrudRepository<UserDto, Integer> {
	// no additional methods needed
}
