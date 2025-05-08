import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpInterceptorFn, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('token');

        // Skip interceptor for auth requests
        if (req.url.includes('/auth/login')) {
            return next.handle(req);
        }

        if (token) {
            const cloned = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            });

            return next.handle(cloned);
        }

        return next.handle(req);
    }
}
// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//     intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//         const token = localStorage.getItem('token');  // Retrieve the token from localStorage
//         if (token) {
//             // Decode the JWT token
//             const decodedToken: any = jwtDecode(token);

//             // Extract the role from the decoded token (ensure the key matches the token's structure)
//             const userRole = decodedToken.ROLE || decodedToken.role; // Adjust depending on token's case sensitivity

//             console.log('Decoded Role:', userRole);  // Log the decoded role (for debugging purposes)

//             // Clone the request and add the Authorization header with the Bearer token
//             const cloned = req.clone({
//                 headers: req.headers.set('Authorization', `Bearer ${token}`)
//             });

//             return next.handle(cloned);
//         }

//         // If no token, pass the original request without modification
//         return next.handle(req);
//     }
// }
