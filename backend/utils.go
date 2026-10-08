package main

func failOnError(errors []error, logger *Logger) {
	for _, v := range errors {
		if v != nil {
			logger.Fatal(v)
		}
	}
}

func orFatal(err error, logger *Logger) {
	if err != nil {
		logger.Fatal(err)
	}
}
