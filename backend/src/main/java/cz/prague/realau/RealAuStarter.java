package cz.prague.realau;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.jpa.convert.threeten.Jsr310JpaConverters;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Main class of a spring boot application.
 * <p>
 * Implementation note: This class needs to be in root of realau package for scanning to work properly.
 */
@SpringBootApplication(scanBasePackageClasses = { RealAuStarter.class,  Jsr310JpaConverters.class })
@PropertySource(RealAuStarter.APP_CONFIG)
@EnableAsync
public class RealAuStarter {

    /** Main application property file name. */
    public static final String APP_CONFIG = "file:./realau.properties";

    /**
     * Main application class.
     *
     * @param args arguments
     */
    public static void main(String[] args) {
        new SpringApplicationBuilder().sources(RealAuStarter.class).run(args);
    }
}
