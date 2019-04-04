package com.server.data.core.database;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

public class DynamicDataSource extends AbstractRoutingDataSource {

	@Override
	protected Object determineCurrentLookupKey() {
		
		return DatabaseContextHolder.getDatabaseType();
	}

}
