.PHONY: build run clean

build:
	docker build -t likelyrec .

run: build
	docker run -it --name likelyrec likelyrec

bash: run
	docker exec -it likelyrec bash

clean:
	docker rm -f likelyrec

cleanImage:
	docker rmi -f likelyrec