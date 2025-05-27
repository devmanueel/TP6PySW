import { Component, OnInit, inject} from '@angular/core';

import { NgClass, CommonModule } from '@angular/common';

import { Router, RouterLink } from '@angular/router';

import { SocioService } from '../../services/socio.service';

import { Socio } from '../../models/socio.model';

@Component({
  selector: 'app-socio-list',
  imports: [CommonModule, RouterLink, NgClass],
  templateUrl: './socio-list.component.html',
  styleUrl: './socio-list.component.css'
})
export class SocioListComponent implements OnInit{

  socios:Socio[]=[];
  isLoading=true;

  errorMsg: string|null=null;

  private socioService=inject(SocioService);
  private router =inject(Router);


  ngOnInit(): void {
    this.loadSocios();
  }

  loadSocios():void{
    this.isLoading = true;
    this.errorMsg= null;

    this.socioService.getSocios().subscribe({
      next: (data)=>{
        this.socios=data;

        this.isLoading=false;
      },
      error:(err)=>{
        console.error(err);
        this.errorMsg=err.mensaje || 'No se pudieron cargar los Socios.';
        this.isLoading=false;

        this.socios=[];
      }
    })
  }
  editSocio(id?:string):void{
    if(id){
      this.router.navigate(['/socios/editar',id]);
    }
  }

  deleteSocio(id?:string):void{
    if(id && confirm('Esta Seeguro de que quieres eliminar este socio?')){
      this.socioService.deleteSocio(id).subscribe({
        next: (response)=> {
          alert(response.mensaje || 'Socio Eliminado Exitosamente');
          this.loadSocios();
        },
        error:(err)=>{
        console.error(err);
        this.errorMsg=err.mensaje || 'Error al eliminar el Socio.';
        }
      });
      
    }

  }

}
