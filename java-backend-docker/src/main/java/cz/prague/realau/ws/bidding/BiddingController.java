package cz.prague.realau.ws.bidding;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import cz.prague.realau.config.rest.support.ParamValidator;
import cz.prague.realau.config.rest.support.StdRestErrorException;

/**
 * Controller for bidding.
 *
 * @author Lukas Marek
 */
@RestController
@RequestMapping("api/bid")
public class BiddingController {

    @Autowired
    private BiddingEngine engine;

    /**
     * Get current bid values.
     * 
	 * @param id auction id
	 * 
	 * @return current bid values
	 * 
     * @throws StdRestErrorException when id is null
     */
    @GetMapping(path = "/{id}")
    public AuctionDto getName(@PathVariable Integer id) throws StdRestErrorException {
    	
    	ParamValidator.notNull(id, "id");
    	
    	return engine.get(id);
    }
    
    /**
     * Bid on auction.
     * 
     * @param id auction id 
     * @param user user id
     * @param amount cash amount
     * 
     * @throws StdRestErrorException when one of the parameters is null 
     */
    @PutMapping(path = "{id}/{user}/{amount}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void bid(@PathVariable Integer id, @PathVariable Integer user, @PathVariable Long amount
    		) throws StdRestErrorException {
    	
    	ParamValidator.notNull(id, "id");
    	ParamValidator.notNull(user, "user");

    	engine.bid(id, user, amount);
    }
}
