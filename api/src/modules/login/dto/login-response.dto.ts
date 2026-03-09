export class LoginResponseDto {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  expiresIn: string;
}
