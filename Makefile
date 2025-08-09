up:
	docker-compose up -d --build

down:
	docker-compose down

deploy:
	docker-compose down
	git reset --hard
	git pull
	docker-compose up -d --build