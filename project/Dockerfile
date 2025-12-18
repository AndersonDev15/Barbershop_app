# Build
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# copiar pom.xml y descargar dependencias
COPY pom.xml .
RUN mvn dependency:go-offline -B

# código fuente
COPY src ./src

# crear el .jar
RUN mvn clean package -DskipTests

# Runtime
FROM eclipse-temurin:17-jdk
WORKDIR /app

# copiar el .jar
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-Duser.timezone=America/Bogota", "-jar", "app.jar"]



