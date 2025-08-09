up:
	docker-compose up -d --build

down:
	docker-compose down

# Blue-Green deployment helpers
ACTIVE_FILE := .active_color
BLUE_SERVICE := tresk-ai-nuxt-blue
GREEN_SERVICE := tresk-ai-nuxt-green

.PHONY: deploy deploy-blue deploy-green active

deploy:
	@active=$$(cat $(ACTIVE_FILE) 2>/dev/null | tr -d '[:space:]'); \
	if [ "$$active" = "blue" ]; then \
		$(MAKE) deploy-green; \
	elif [ "$$active" = "green" ]; then \
		$(MAKE) deploy-blue; \
	else \
		echo "Unknown or missing active color '$$active'. Defaulting to deploy-blue"; \
		$(MAKE) deploy-blue; \
	fi

deploy-blue:
	git reset --hard
	git pull
	# 1) Build only BLUE image
	docker-compose build $(BLUE_SERVICE)
	# 2) Switch traffic: remove stale container and start BLUE with high priority; keep GREEN running
	docker-compose rm -f $(BLUE_SERVICE) || true
	BLUE_PRIORITY=200 docker-compose up -d --no-deps --no-build $(BLUE_SERVICE)
	# 3) Stop inactive (GREEN) to free resources
	docker-compose stop $(GREEN_SERVICE)
	@echo blue > $(ACTIVE_FILE)
	@echo "Switched active color to BLUE"

deploy-green:
	git reset --hard
	git pull
	# 1) Build only GREEN image
	docker-compose build $(GREEN_SERVICE)
	# 2) Switch traffic: remove stale container and start GREEN with high priority; keep BLUE running
	docker-compose rm -f $(GREEN_SERVICE) || true
	GREEN_PRIORITY=200 docker-compose up -d --no-deps --no-build $(GREEN_SERVICE)
	# 3) Stop inactive (BLUE) to free resources
	docker-compose stop $(BLUE_SERVICE)
	@echo green > $(ACTIVE_FILE)
	@echo "Switched active color to GREEN"

active:
	@if [ -f $(ACTIVE_FILE) ]; then echo "Active color: $$(cat $(ACTIVE_FILE))"; else echo "Active color is unknown (file $(ACTIVE_FILE) not found)"; fi