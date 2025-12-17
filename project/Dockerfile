FROM eclipse-temurin:17-jdk

ARG JAR_FILE=target/barbershop_app-0.0.1.jar

WORKDIR /app

COPY ${JAR_FILE} app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
