package cz.prague.realau.ws.user;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;

/**
 * User DTO.
 *
 * @author Lukas Marek
 */
@Entity
@SuppressWarnings("javadoc")
public class UserDto implements Serializable {

    private static final long serialVersionUID = 1540378450077605242L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    
    private String passHash;

    @Lob
    private String data;

    public UserDto(String passHash, String data) {
        super();
        this.id = null;
        this.passHash = passHash;
        this.data = data;
    }

    // only for JPA and WS
    @SuppressWarnings("unused")
	private UserDto() {

    }

    public Integer getId() {
        return id;
    }

    public String getPassHash() {
		return passHash;
	}

    public String getData() {
        return data;
    }
}
