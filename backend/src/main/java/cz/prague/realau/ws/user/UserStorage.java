package cz.prague.realau.ws.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;

/**
 * User storage.
 * 
 * @author Lukas Marek
 */
@Service
class UserStorage {

    @Autowired
    private CrudRepository<UserDto, Integer> repo;

    /**
     * Stores user.
     * 
     * @param passHash hashed password
     * @param data additional data
     * 
     * @return newly generated id
     */
	public int store(String passHash, String data) {
		return repo.save(new UserDto(passHash, data)).getId();
	}

	/**
	 * Validates password hash for a user. 
	 * 
	 * @param id user id
	 * @param passHash password hash
	 * 
	 * @return whether password hash is valid for that user
	 */
	public boolean validate(Integer id, String passHash) {
		return repo.findOne(id).getPassHash().equals(passHash);
	}
}
