FROM oven/bun
WORKDIR /app
COPY . .
RUN bun install
VOLUME /app/data
EXPOSE 3000
CMD ["bun", "start"]
