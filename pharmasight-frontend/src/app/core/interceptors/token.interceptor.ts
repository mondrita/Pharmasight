import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,
    HttpInterceptorFn,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import {catchError, mergeMap, Observable, of, throwError} from 'rxjs';
import {inject} from "@angular/core";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";

export const TokenInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
    const router = inject(Router);
    let url = req.url;
    console.log(url)
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
        url = environment.BASE_URL + url;
        const token = localStorage?.getItem('token') ? localStorage?.getItem('token') : ''
        const newReq = req.clone({
            url,
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        return next(newReq)
    }

    return next(req.clone({url}))


    // function handleData(event: HttpResponse<any>): Observable<any> {
    //
    //     switch (event.status) {
    //         case 200:
    //             break;
    //         case 201:
    //             break;
    //     }
    //     return of(event);
    // }
    //
    // function handleError(event: HttpErrorResponse) {
    //     switch (event.status) {
    //         case 400:
    //             handle400Error(event);
    //             break;
    //         case 401:
    //             handle401Error(event);
    //             break;
    //         case 403:
    //             handle403Error(event);
    //             break;
    //         case 404:
    //             handle404Error(event);
    //             break;
    //         case 500:
    //             handle500Error(event);
    //             break;
    //     }
    //     return of(event);
    // }
    //
    // function handle400Error(event: HttpResponse<any> | HttpErrorResponse) {
    // }
    //
    // function handle401Error(event: HttpResponse<any> | HttpErrorResponse) {
    //     router.navigate(['auth/login']);
    // }
    //
    // function handle403Error(event: HttpResponse<any> | HttpErrorResponse) {
    // }
    //
    // function handle404Error(event: HttpResponse<any> | HttpErrorResponse) {
    // }
    //
    // function handle405Error(event: HttpResponse<any> | HttpErrorResponse) {
    // }
    //
    // function handle409Error(event: HttpResponse<any> | HttpErrorResponse) {
    // }
    //
    // function handle500Error(event: HttpResponse<any> | HttpErrorResponse) {
    // }
};
