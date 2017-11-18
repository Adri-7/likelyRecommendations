.PHONY: build run clean

build:
	docker build -t likelyrec .

run:
	docker run -it --name likelyrec likelyrec

bash:
	docker exec -it likelyrec bash

clean:
	docker rm -f likelyrec

cleanImage:
	docker rmi -f likelyrec