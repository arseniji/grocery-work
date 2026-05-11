package com.gitlab.arsenji.bffGrocery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BffGroceryApplication {

	static void main(String[] args) {
		SpringApplication.run(BffGroceryApplication.class, args);
	}

}
