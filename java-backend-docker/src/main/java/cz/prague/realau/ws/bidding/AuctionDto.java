package cz.prague.realau.ws.bidding;

import java.io.Serializable;
import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

/**
 * Auction DTO.
 *
 * @author Lukas Marek
 */
@Entity
@SuppressWarnings("javadoc")
public class AuctionDto implements Serializable {

	private static final long serialVersionUID = 6100038483874644054L;

	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    
    private Integer user;
    
    // TODO should be zoned
    private LocalDateTime startDateTime;

    // TODO should be zoned
    private LocalDateTime endDateTime;
    
    private boolean started;
    
    private boolean ended;
    
    private Long amount;

    public AuctionDto(Integer id, Integer user, Long amount, LocalDateTime startDateTime, LocalDateTime endDateTime,
    		boolean started, boolean ended) {
        super();
        this.id = id;
        this.user = user;
        this.amount = amount;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
        this.started = started;
        this.ended = ended;
    }

    // only for JPA and WS
    @SuppressWarnings("unused")
	private AuctionDto() {

    }

    public Integer getId() {
        return id;
    }

    public Integer getUser() {
		return user;
	}
    
	public LocalDateTime getStartDateTime() {
		return startDateTime;
	}

	public LocalDateTime getEndDateTime() {
		return endDateTime;
	}

	public boolean isStarted() {
		return started;
	}

	public boolean isEnded() {
		return ended;
	}

    public Long getAmount() {
        return amount;
    }
}
