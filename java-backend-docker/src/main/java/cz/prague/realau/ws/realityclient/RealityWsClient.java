package cz.prague.realau.ws.realityclient;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import cz.prague.realau.ws.bidding.AuctionDto;

/**
 * Client for communication with PHP server.
 * 
 * @author Lukas Marek
 *
 */
@Service
public class RealityWsClient {

	@Value("${phpserver}")
	private String server;
	
    private final RestTemplate restTemplate = new RestTemplate();
	
	/**
	 * Get all auctions.
	 * 
	 * @return list of auctions
	 */
	public List<AuctionDto> getAuctions() {
		
        Auction[] auctions = restTemplate.getForObject(server + "/api/auctions", Auction[].class);
		return Arrays.stream(auctions).map(a -> new AuctionDto(a.getId(), a.getUser(), a.getAmount(),
				a.getStartDateTime(), a.getEndDateTime(), a.isStarted(), a.isEnded()))
				.collect(Collectors.toList());
	}

	/**
	 * Update auction amount.
	 * 
	 * @param id auction id
	 * @param amount new amount
	 */
	public void updateAuction(Integer id, Long amount) {
		 HttpHeaders headers = new HttpHeaders();
		 headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
		 HttpEntity<String> entity = new HttpEntity<String>("{ \"actualPrice\" : " + amount + " }", headers);
		restTemplate.put(server + "/api/auctions-updatePrice/" + id, entity);
	}

	/**
	 * Update last bidder.
	 * 
	 * @param id auction id
	 * @param user last bidder id
	 */
	public void updateLastBidder(Integer id, Integer user) {
		// TODO Auto-generated method stub
		
	}
}
