package cz.prague.realau.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

/**
 * Application security configuration.
 *
 * @author Lukas Marek
 */
// If you find something like: "@Order on WebSecurityConfigurers must be unique" set order higher than default
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	// TODO improve security settings if needed
	
    @Override
    public void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.authorizeRequests().antMatchers("/").permitAll();

        // cross-site request forgery is disabled
        httpSecurity.csrf().disable();
    }
}
