import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { AuthJwtPayload } from '../types/token.model'

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.user as AuthJwtPayload
    return true
  }
}
