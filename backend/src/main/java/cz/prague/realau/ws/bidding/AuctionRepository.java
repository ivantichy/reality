package cz.prague.realau.ws.bidding;

import org.springframework.data.repository.CrudRepository;

/**
 * Bid repository.
 *
 * @author Lukas Marek
 */
interface AuctionRepository extends CrudRepository<AuctionDto, Integer> {
	// no additional methods needed
}
