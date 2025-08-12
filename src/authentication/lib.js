"use server"

import { SignJWT, jwtVerify } from "jose";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const secretKey=process.env.SECRET_KEY;
const URL_REGISTER_USER = process.env.NEXT_PUBLIC_URL_SIGNUP;
const URL_LOGIN_USER = process.env.NEXT_PUBLIC_URL_LOGIN;

const key=new TextEncoder().encode(secretKey);
const timeExpiration =  60 * 60 * 1000;

export async function encrypt(payload) {
    return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(new Date(Date.now() + timeExpiration))
    .sign(key);
}

export async function decrypt(input){
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
}

export async function login(dataUser) {
    const formData = {
      userName: dataUser.username,
      password: dataUser.password,
    };
  
    const response = await fetch(URL_LOGIN_USER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
  
    if (!response.ok) {
      const rpta = await response.json();
      return {
        error: true,
        message: rpta?.detail,
      };
    }
  
    const responseJson = await response.json();
    const { access_token, refresh_token, token_type } = responseJson;
  
    // ⬇️ Decodificar el JWT
    let decodedToken;
    try {
      decodedToken = jwtDecode(access_token);
      console.log("Token decodificado:", decodedToken);
    } catch (error) {
      console.error("Error decodificando el token:", error);
      return { error: true, message: "Token inválido" };
    }
  
    // Guardar en cookie encriptada
    const expires = new Date(Date.now() + timeExpiration);
    const user = {
      username: formData.userName,
      access_token,
      refresh_token,
      token_type,
      payload: decodedToken, // ✅ Guardamos también los datos decodificados
    };
    const session = await encrypt({ user, expires });
  
    (await cookies()).set("dashboard-session", session, {
      expires,
      httpOnly: true,
    });
  
    return {
      error: false,
      message: "Ingreso exitoso",
      tokenData: decodedToken, // ✅ Retornamos datos decodificados
    };
  }

export async function logout() {
    cookies().set("dashboard-session", "", {expires:new Date(0)})
    redirect('/login');
}

export async function getSession() {
    const session = (await cookies()).get("dashboard-session")?.value;
    if(!session) return null;
    return await decrypt(session);
}

export async function signUp(dataUser) {
    const response = await fetch(URL_REGISTER_USER,{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(dataUser)
    });
    if (!response.ok) {
        const resp = await response.json();
        return {
            error : true,
            message : resp?.detail
        }
    }

    const responseJson = await response.json();
    const expires = new Date(Date.now()+timeExpiration);
    const user = {
        username : dataUser?.userName, 
        access_token : responseJson?.access_token, 
        refresh_token : responseJson?.refresh_token,
        token_type : responseJson?.token_type
    };
    const session = await encrypt({user, expires})
    (await cookies()).set("session", session, {expires, httpOnly : true});
    console.log(responseJson);
    
    return {
        error : false,
        message : "Ingreso exitoso"
    }
}