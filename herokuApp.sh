#!/bin/zsh

for recipe in recipes/*.js(:t:r); do
 app=yayuhh-swiper-$recipe
 git remote add $app git@heroku.swiper:$app.git
 git push $app master:master
 git remote remove $app
done
