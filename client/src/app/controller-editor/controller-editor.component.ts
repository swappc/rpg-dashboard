import { Component, OnInit } from '@angular/core';
import { Controller } from '../midi.service';
import { LibraryService } from '../library.service';

@Component({
  selector: 'app-controller-editor',
  templateUrl: './controller-editor.component.html',
  styleUrls: ['./controller-editor.component.css']
})
export class ControllerEditorComponent implements OnInit {
  controllers: Controller[]
  constructor(private libraryService: LibraryService) { 
    libraryService.getMidiControllers().subscribe((controllers)=>{
      this.controllers = controllers;
    })
  }

  ngOnInit() {
  }

  controllerNotSelected(){
    this.controllers.length==0;
  }

  editControllerClicked(){

  }

  deleteControllerClicked(){

  }

  newControllerClicked(){
    
  }

  controllerChanged(event, controller){

  }

}
