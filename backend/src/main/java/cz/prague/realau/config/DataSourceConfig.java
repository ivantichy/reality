package cz.prague.realau.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

/**
 * Main DB store configuration.
 */
@Configuration
@PropertySource(value="classpath:config.properties")
public class DataSourceConfig {

//    private static final String H2_SETTINGS = ";DB_CLOSE_ON_EXIT=FALSE;AUTO_RECONNECT=TRUE";

    @Value("${store}")
    private String configDir;

    @Value("${spring.datasource.driverClassName}")
    private String driverClassName;

    @Value("${spring.datasource.username}")
    private String user;

    @Value("${spring.datasource.password}")
    private String password;

    /**
     * Creates data source.
     * 
     * @return data source
     */
    @Bean(destroyMethod = "close")
    public DataSource dataSource() {
        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setDriverClassName(driverClassName);
//        hikariConfig.setJdbcUrl("jdbc:h2:file:" + configDir + "/h2config.store" + H2_SETTINGS);
        hikariConfig.setJdbcUrl("jdbc:h2:mem:test");
        hikariConfig.setUsername(user);
        hikariConfig.setPassword(password);

        hikariConfig.setMaximumPoolSize(5);
        hikariConfig.setIdleTimeout(10000);
        hikariConfig.setConnectionTestQuery("SELECT 1");

        final HikariDataSource ds = new HikariDataSource(hikariConfig);
        return ds;
    }
}