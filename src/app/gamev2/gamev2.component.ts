import { Component, OnInit, ElementRef, Renderer2, AfterViewChecked, AfterViewInit, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';


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
  viruses: any = [];
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
    private renderer: Renderer2,
    private socket: Socket
  ) {}

  ngOnInit() {
    const data = {x: 1500, y: 1500, r:550};

    this.socket.on('heartbeat', i => {
      console.log(i, 'j');
    });

  }

  // asobservable  subscribe => data

  ngAfterViewInit() {
    new p5(p => {


      p.setup = () => {
        p.createCanvas(1800, 1200);
        this.blob = this.Blob(1500 , 1500 , 30);
        for (let i = 0; i < 300; i++) {
          let x = p.random(0, 5000);
          let y = p.random(0, 5000);
          this.blobs[i] = this.Blob(x, y, 20);
        }
        for (let i = 0; i < 7; i++) {
          let x = p.random(0, 25500);
          let y = p.random(0, 25500);
          this.viruses[i] = this.Blob(x, y, 200);
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
        for (var i = -49; i < 25500; i += 50) {
          p.line(i, 0, i, 25500);
          p.line(25500, i, 0, i);
        }


        let newArr: any = [];
        this.blobs.map( i => {
          p.fill(i.color);
          p.ellipse(i.pos.x, i.pos.y, i.r * 2, i.r * 2);
          let d = p5.Vector.dist(this.blob.pos, i.pos);
          if (d < this.blob.r + i.r) {
            let sum = (p.PI * (i.r * i.r)) + (p.PI *  (this.blob.r * this.blob.r));
            if (this.blob.r < 4000) {
              // this.blob.r = this.blob.r + 2;
              this.blob.r = p.sqrt(sum / p.PI);
            }
            i.pos.x = p.random(0, 2550) + this.blob.pos.x;
            i.pos.y = p.random(0, 2550) + this.blob.pos.y;
            return;
          }
        });

        this.viruses.map( i => {
          p.fill('#00ff00');
          p.ellipse(i.pos.x, i.pos.y, i.r * 2, i.r * 2);
          let d = p5.Vector.dist(this.blob.pos, i.pos);
          if (d < this.blob.r + i.r) {
            let sum = (p.PI * (i.r * i.r)) + (p.PI *  (this.blob.r * this.blob.r));
            if (this.blob.r < 4000 && this.blob.r > i.r) {
              this.blob.r = this.blob.r + 200;
              i.pos.x = p.random(0, 15000);
              i.pos.y = p.random(0, 15000);
              return;
            }
          }
        });

        //create / show
        p.fill(0);
        p.ellipse(this.blob.pos.x, this.blob.pos.y, this.blob.r * 2, this.blob.r * 2);

        // update;
        var newvel = p.createVector(p.mouseX - p.width / 2, p.mouseY - p.height / 2);
        if (this.blob.pos.x > -1 && this.blob.pos.y > -1 && this.blob.pos.x < 25500 && this.blob.pos.y < 25500) {
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
          if (this.blob.pos.x > 25500 && p.createVector(p.mouseX - p.width / 2, p.mouseY - p.height / 2).setMag(3).x < 1){
            // console.log('error', p.createVector(p.mouseX - p.width / 2, p.mouseY - p.height / 2).setMag(3));
            newvel.setMag(this.blob.r / 10);
            this.blob.vel.lerp(newvel, 0.2)
            this.blob.pos.add(this.blob.vel);
          }
          if (this.blob.pos.y > 25500 && p.createVector(p.mouseX - p.width / 2, p.mouseY - p.height / 2).setMag(3).y < 1){
            newvel.setMag(this.blob.r / 10);
            this.blob.vel.lerp(newvel, 0.2)
            this.blob.pos.add(this.blob.vel);
          }
        }
        if (this.blob.r > 2000) {
          this.blob.r -=0.2;
        } else if  (this.blob.r > 4000) {
          this.blob.r -=0.4;
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
