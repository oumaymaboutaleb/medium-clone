import { ExpressRequest } from "@app/types/expressRequest.interface";
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate{
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<ExpressRequest>();

    console.log('request', request.user);
    
    if(request.user){
      return true;
      
    }
    throw new HttpException('NOT AUTHORIZED',HttpStatus.UNAUTHORIZED);
    
    
  }
}