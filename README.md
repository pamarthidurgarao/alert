Sure, let's walk through an example of using Swagger Request Validator in Java for OpenAPI contract testing. We'll use the `swagger-request-validator-core` library to validate API requests and responses against an OpenAPI specification.

### Prerequisites

1. **Java** and **Maven** installed.
2. **An OpenAPI Specification** (e.g., `openapi.yaml`).

### Steps

1. **Create a Maven Project**
2. **Add Dependencies**
3. **Set Up Swagger Request Validator**
4. **Write Tests**

### 1. Create a Maven Project

If you don't already have a Maven project, create one:

```sh
mvn archetype:generate -DgroupId=com.example -DartifactId=openapi-contract-testing -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
cd openapi-contract-testing
```

### 2. Add Dependencies

Add the required dependencies in your `pom.xml`:

```xml
<dependencies>
    <dependency>
        <groupId>io.swagger.parser.v3</groupId>
        <artifactId>swagger-parser-v3</artifactId>
        <version>2.0.29</version>
    </dependency>
    <dependency>
        <groupId>io.swagger</groupId>
        <artifactId>swagger-request-validator-core</artifactId>
        <version>2.10.1</version>
    </dependency>
    <dependency>
        <groupId>org.apache.httpcomponents</groupId>
        <artifactId>httpclient</artifactId>
        <version>4.5.13</version>
    </dependency>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter-api</artifactId>
        <version>5.7.0</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter-engine</artifactId>
        <version>5.7.0</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### 3. Set Up Swagger Request Validator

Create a class `OpenApiContractTest` to set up and run your tests:

```java
package com.example.openapi;

import io.swagger.parser.OpenAPIParser;
import io.swagger.v3.parser.core.models.ParseOptions;
import io.swagger.v3.parser.core.models.SwaggerParseResult;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.request.validator.Request;
import io.swagger.request.validator.RequestValidator;
import io.swagger.request.validator.Response;
import io.swagger.request.validator.ResponseValidator;
import io.swagger.request.validator.ValidationReport;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.junit.jupiter.api.Test;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class OpenApiContractTest {

    private static final String OPENAPI_SPEC_PATH = "path/to/your/openapi.yaml";
    private static final String API_BASE_URL = "http://localhost:3000";

    @Test
    public void validateGetSampleEndpoint() throws IOException {
        // Load the OpenAPI specification
        OpenAPI openAPI = loadOpenApiSpec(OPENAPI_SPEC_PATH);

        // Create request and response validators
        RequestValidator requestValidator = new RequestValidator(openAPI);
        ResponseValidator responseValidator = new ResponseValidator(openAPI);

        // Validate the request
        Request request = new Request.Builder()
                .path("/api/sample")
                .method("get")
                .build();
        ValidationReport requestReport = requestValidator.validate(request);
        assertTrue(requestReport.isValid(), "Request validation failed: " + requestReport);

        // Make the API call
        CloseableHttpClient httpClient = HttpClients.createDefault();
        HttpGet httpGet = new HttpGet(API_BASE_URL + "/api/sample");
        HttpResponse httpResponse = httpClient.execute(httpGet);

        // Validate the response
        Response response = new Response.Builder()
                .statusCode(httpResponse.getStatusLine().getStatusCode())
                .body(httpResponse.getEntity().getContent())
                .build();
        ValidationReport responseReport = responseValidator.validate(response);
        assertTrue(responseReport.isValid(), "Response validation failed: " + responseReport);

        httpClient.close();
    }

    private OpenAPI loadOpenApiSpec(String path) {
        ParseOptions options = new ParseOptions();
        options.setResolve(true);
        SwaggerParseResult result = new OpenAPIParser().readLocation(path, null, options);
        return result.getOpenAPI();
    }
}
```

### 4. Write Tests

Replace the placeholder endpoint (`/api/sample`) with your actual API endpoint and adjust the request and expected response schema as needed.

### 5. Run the Tests

Run the tests using Maven:

```sh
mvn test
```

### Example OpenAPI Specification

Here's an example of what your `openapi.yaml` file might look like:

```yaml
openapi: 3.0.0
info:
  title: Sample API
  version: 1.0.0
paths:
  /api/sample:
    get:
      summary: Sample endpoint
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                required:
                  - message
```

### Explanation

1. **Loading the OpenAPI Spec**: The OpenAPI specification is loaded from a file (`openapi.yaml`).
2. **Request and Response Validators**: The `swagger-request-validator` package is used to validate requests and responses.
3. **Writing the Test**: The test makes an actual API call using `HttpClient` and validates both the request and the response against the OpenAPI spec.

By following these steps, you can perform contract testing on your API to ensure it adheres to the OpenAPI specification. Adjust the endpoints, methods, and validation rules according to your specific API and OpenAPI spec.
