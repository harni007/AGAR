import {AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, AfterViewInit {

  @ViewChild('myCanvas', {static: false}) myCanvas: ElementRef;

  public context: any;
  colors = [
    'red',
    'green',
    'blue',
    'black',
    'yellow',
    'purple',
    'cyan',
  ];

  blobs = 100;
  food = [];
  currentX = 20;
  currentMouseX = 0;
  currentMouseY = 0;
  currentY = 20;

  constructor() {
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event:any) {
    this.currentMouseX = event.clientX / 6.4;
    this.currentMouseY = event.clientY / 6;
  }

  ngOnInit() {
    for( let i = 0; i < this.blobs; i++) {
      let randomX = (Math.random() * (300 - 10 + 1)) + 10;
      let randomY = (Math.random() * (300 - 10 + 1)) + 10;
      let randomNum  = Math.floor((Math.random() * (6 + 1)));
      let randomColor = this.colors[randomNum];
      let data = {x: randomX, y: randomY, r: 1, color: randomColor};
      // @ts-ignore
      this.food.push(data);
    }
  }

  ngAfterViewInit() {

    this.context = this.myCanvas.nativeElement.getContext("2d");

    setInterval( () =>{
      this.context.clearRect(0, 0, this.myCanvas.nativeElement.width, this.myCanvas.nativeElement.height);
      this.food.map( i => {
        // @ts-ignore
        this.createBlob(i?.x, i?.y, i?.r, i?.color);
      });
      this.createBlob(this.currentMouseX, this.currentMouseY, 10, 'red');
      }, 20);

  }

  createBlob(x:any, y:any, r:any, color: string): any {
    this.context.beginPath();
    this.context.ellipse(x, y, r * 2, r * 2, Math.PI / 4, 0, 2 * Math.PI);
    this.context.fillStyle = color;
    this.context.fill();
    this.context.stroke();
  }

}
