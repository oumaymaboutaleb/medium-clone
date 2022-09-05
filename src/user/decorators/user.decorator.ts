import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  // from execution context we can get our request
  const request = ctx.switchToHttp().getRequest();

  // simply return null
  if (!request.user) {
    return null;
  }
  // select some data
  if (data) {
    return request.user[data];
  }
  // or return the user
  return request.user;
});
