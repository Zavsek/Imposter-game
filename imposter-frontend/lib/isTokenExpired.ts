import { jwtDecode, JwtPayload } from "jwt-decode";

interface customJwtPayload extends JwtPayload{
    username?:string,
    role?: 'USER' | 'GUEST'
}


export  const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  try {
    const  decoded = jwtDecode<customJwtPayload>(token);
    const currentTime = Date.now() / 1000;
    if(decoded.exp){
        return decoded.exp < currentTime;
    }
    else return true;
  } catch (error) {
        return true;
  }
}
