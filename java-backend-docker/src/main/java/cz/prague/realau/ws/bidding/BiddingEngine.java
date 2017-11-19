package cz.prague.realau.ws.bidding;

import java.time.LocalDateTime;
import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;

import cz.prague.realau.config.rest.support.StdRestErrorException;
import cz.prague.realau.ws.realityclient.RealityWsClient;

/**
 * Bidding engine.
 * 
 * @author Lukas Marek
 */
@Service
class BiddingEngine {

	private int MIN_ADDED_AMOUNT = 10_000;
	
	private volatile boolean exit = false;
	
    @Autowired
    private CrudRepository<AuctionDto, Integer> repo;
    
    @Autowired
    private RealityWsClient wsClient;

    /**
     * Initialize auction control.
     */
    @PostConstruct
    public void init() {
    	
    	// read auctions from server
    	List<AuctionDto> auctions = wsClient.getAuctions();
    	auctions.forEach(repo::save);
    	
    	// TODO improve threading
    	new Thread(this::controlAuction).start();
    }
    
    /**
     * Cleanup auction control.
     */
    @PreDestroy
    public void cleanup() {
    	exit = true;
    }
    
    private void controlAuction() {
    	
    	// TODO will not scale with many auctions - like the whole locking here
    	
    	try {
    		while(! exit) {
    			
    			synchronized(this) {
    		
	    			Iterator<AuctionDto> adi = repo.findAll().iterator();
	    			LocalDateTime now = LocalDateTime.now();
	    			
	    			while(adi.hasNext()) {
	    				
	    				AuctionDto auction = adi.next();
	    				
	    				if(! auction.isStarted() && auction.getStartDateTime().isBefore(now)) {
	    					auction = repo.save(new AuctionDto(auction.getId(), auction.getUser(), auction.getAmount(),
	    							auction.getStartDateTime(), auction.getEndDateTime(), true, auction.isEnded()));
	    				}
	    				
	    				if(! auction.isEnded() && auction.getEndDateTime().isBefore(now)) {
	    					auction = repo.save(new AuctionDto(auction.getId(), auction.getUser(), auction.getAmount(),
	    							auction.getStartDateTime(), auction.getEndDateTime(), auction.isStarted(), true));
	    				}
	    			}
    			}
    			
				Thread.sleep(1000); // every sec or so
    		}
    	} catch (InterruptedException e) {
			Thread.currentThread().interrupt(); // just swallow exception and set interrupted
		}
    }
    
    /**
     * Get current bid values.
     * 
	 * @param id auction id
	 * 
	 * @return current bid values
     */
	public synchronized AuctionDto get(Integer id) {
		return repo.findOne(id);
	}

    /**
     * Bid on auction.
     * 
     * @param id auction id 
     * @param user user id
     * @param amount cash amount
     * 
     * @throws StdRestErrorException error during bidding
     */
	public synchronized void bid(Integer id, Integer user, Long amount) throws StdRestErrorException {
		
		AuctionDto bid = repo.findOne(id);
		
		if(bid == null) {
			throw new StdRestErrorException("Auction does not exist");
		}
		
		if(! bid.isStarted()) {
			throw new StdRestErrorException("Auction is not started yet");
		}
		
		if(bid.isEnded()) {
			throw new StdRestErrorException("Auction ended already");
		}
		
		// TODO do we want this?
		if(bid.getUser().equals(user)) {
			throw new StdRestErrorException("Highest bid already done by this user");
		}
		
		if(bid.getAmount() >= amount) {
			throw new StdRestErrorException("The bid is lower or equal to the current valid bid");
		}
		
		if(bid.getAmount() + MIN_ADDED_AMOUNT >= amount) {
			throw new StdRestErrorException("The bid has to be higher than the current valid bid at least by "
					+ MIN_ADDED_AMOUNT);
		}
		
		repo.save(new AuctionDto(bid.getId(), user, amount, bid.getStartDateTime(), bid.getEndDateTime(),
				bid.isStarted(), bid.isEnded()));
		
		wsClient.updateAuction(id, amount);
		wsClient.updateLastBidder(id, user);
	}
}
