import { Component, OnInit, ElementRef, Renderer2, AfterViewChecked, AfterViewInit, ViewChild } from '@angular/core';


import * as p5 from 'p5';

@Component({
  selector: 'app-gamev2',
  templateUrl: './gamev2.component.html',
  styleUrls: ['./gamev2.component.scss']
})
export class Gamev2Component implements OnInit, AfterViewInit {


  @ViewChild('game', {static: false}) game: ElementRef;

  blob:any;
  blobs: any = [];
  zoom = 1

  colors = [
    'red',
    'green',
    'blue',
    'black',
    'yellow',
    'purple',
    'cyan',
  ];
  height: any;
  width: any;
  show = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    new p5(p => {


      p.setup = () => {
        p.createCanvas(1800, 1200);
        this.blob = this.Blob(1500 , 1500 , 500);
        for (let i = 0; i < 2000; i++) {
          let x = p.random(0, 25000);
          let y = p.random(0, 25000);
          this.blobs[i] = this.Blob(x, y, 20);
        }
        // apply random color
        this.blobs.map( i => {
          let randomNum  = Math.floor((Math.random() * (6 + 1)));
          let randomColor = this.colors[randomNum];
          i.color = randomColor;
        });
      };

      p.draw = () => {
        this.show = true;
        p.background(255);

        // translate
        p.translate(p.width / 2, p.height / 2);
        var newzoom = 100 / this.blob.r;
        if (newzoom <= 0.002) {
          newzoom = 0.002;
        }
        this.zoom = p.lerp(this.zoom, newzoom, 0.1);
        p.scale(this.zoom);
        p.translate(-this.blob.pos.x, -this.blob.pos.y);
        for (var i = -49; i < 50500; i += 50) {
          p.line(i, 0, i, 50500);
          p.line(50500, i, 0, i);
        }


        let newArr: any = [];
        this.blobs.map( i => {
          p.fill(i.color);
          p.ellipse(i.pos.x, i.pos.y, i.r * 2, i.r * 2);
          let d = p5.Vector.dist(this.blob.pos, i.pos);
          if (d < this.blob.r + i.r) {
            let sum = (p.PI * (i.r * i.r)) + (p.PI *  (this.blob.r * this.blob.r));
            // this.blob.r = p.sqrt(sum / p.PI);
            this.blob.r = this.blob.r + 2;
            i.pos.x = p.random(0, 10000) + this.blob.pos.x;
            i.pos.y = p.random(0, 10000) + this.blob.pos.y;
            return;
          }
        });

        //create / show
        p.fill(0);
        p.ellipse(this.blob.pos.x, this.blob.pos.y, this.blob.r * 2, this.blob.r * 2);

        // update;
        var newvel = p.createVector(p.mouseX - p.width / 2, p.mouseY - p.height / 2);
        if (this.blob.pos.x > -1 && this.blob.pos.y > -1 && this.blob.pos.x < 50000 && this.blob.pos.y < 50000) {
          newvel.setMag(this.blob.r / 10);
          this.blob.vel.lerp(newvel, 0.2)
          this.blob.pos.add(this.blob.vel);
        } else {
          if (this.blob.pos.x < -1 && p.createVector(p.mouseX - p.width / 2, p.mouseY - p.height / 2).setMag(3).x > 0){
            newvel.setMag(this.blob.r / 10);
            this.blob.vel.lerp(newvel, 0.2)
            this.blob.pos.add(this.blob.vel);
          }
          if (this.blob.pos.y < 0 && p.createVector(p.mouseX - p.width / 2, p.mouseY - p.height / 2).setMag(3).y > 0){
            newvel.setMag(this.blob.r / 10);
            this.blob.vel.lerp(newvel, 0.2)
            this.blob.pos.add(this.blob.vel);
          }
          if (this.blob.pos.x > 50000 && p.createVector(p.mouseX - p.width / 2, p.mouseY - p.height / 2).setMag(3).x < 1){
            // console.log('error', p.createVector(p.mouseX - p.width / 2, p.mouseY - p.height / 2).setMag(3));
            newvel.setMag(this.blob.r / 10);
            this.blob.vel.lerp(newvel, 0.2)
            this.blob.pos.add(this.blob.vel);
          }
          if (this.blob.pos.y > 50000 && p.createVector(p.mouseX - p.width / 2, p.mouseY - p.height / 2).setMag(3).y < 1){
            newvel.setMag(this.blob.r / 10);
            this.blob.vel.lerp(newvel, 0.2)
            this.blob.pos.add(this.blob.vel);
          }
        }
      };

    }, this.el.nativeElement);

  }

  Blob(x,y,r) {
    return new p5( p => {
      p.pos = p.createVector(x, y);
      p.r = r;
      p.vel = p.createVector(0, 0);
    });

  }
}
