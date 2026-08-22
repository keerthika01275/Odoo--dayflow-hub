# ── Stage 1: Build ──────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml first for dependency caching
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build
COPY backend/src ./src
RUN mvn clean package -DskipTests -B

# ── Stage 2: Run ────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
