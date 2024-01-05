import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { NotificationsComponent } from './components/modals/notifications/notifications.component';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  bsModalRef?: BsModalRef

  constructor(private modalService:BsModalService) { }

  showNotification(isSuccess:boolean, title:string,message:string){
    const initialState: ModalOptions = {
      initialState :{
        isSuccess,title,message
      }
    }

    this.bsModalRef=this.modalService.show(NotificationsComponent,initialState)
  }
}
