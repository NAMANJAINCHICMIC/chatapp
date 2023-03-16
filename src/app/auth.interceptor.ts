import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";

@Injectable()
export class AuthInterceptors implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
      
    const token=localStorage.getItem('token');
    if (token) {
    req=req.clone({
      headers:req.headers.set('Authorization',`bearer ${token}`)
    })
    return next.handle(req)
    .pipe(catchError((error: HttpErrorResponse) => {
      if (error.status === 401 ) {
        // alert('401 Unathurized');
        console.log("Unathurized")
       localStorage.clear()

      }
      return throwError(error);
    }))
  } else {
    return next.handle(req);
  }
  }
}