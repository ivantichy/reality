package cz.prague.realau.ws.realityclient;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Auction object.
 * 
 * @author Lukas Marek
 */
@SuppressWarnings("javadoc")
public class Auction {

	// TODO needs more work
	
	@JsonProperty
	private int id;
	@JsonProperty
	private int active;
	@JsonProperty
	private String stav;
	@JsonProperty
	private String datum_ukonceni;
	@JsonProperty
	private String cena_vyvolavaci;

	private Map<String, String> other = new HashMap<String, String>();

	@JsonAnyGetter
	public Map<String, String> other() {
		return other;
	}

	@JsonAnySetter
	public void setOther(String name, String value) {
		other.put(name, value);
	}

	public int getId() {
		return id;
	}
	
	public int getUser() {
		return 0;
	}
	
	public long getAmount() {
		return Double.valueOf(cena_vyvolavaci).longValue();
	}

	public LocalDateTime getStartDateTime() {
		return LocalDateTime.now();
	}
	
	public LocalDateTime getEndDateTime() {
		return LocalDateTime.of(LocalDate.parse(datum_ukonceni).plusDays(1), LocalTime.MIDNIGHT);
	}
	
	public boolean isStarted() {
		return active == 1;
	}
	
	public boolean isEnded( ) {
		return "ukoncena".equals(stav);
	}
}
