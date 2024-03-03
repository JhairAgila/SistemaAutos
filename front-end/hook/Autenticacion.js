import { enviar } from './conexion';
import {save, saveToken } from './SesionUtil';
import Cookie from 'js-cookie';

export async function inicio_sesion(data){
    // const sesion = await enviar('index.php?funcion=inicio', data);
    const sesion = await enviar('login', data);
    const sesionUser = JSON.stringify(sesion)
    if(sesion.code == 200 && sesion.data.token){
        saveToken(sesion.data.token);
        Cookie.set("my-token", sesion.data.token, {
            expires: 1,
            secure: true,
            sameSite: 'strict',
            
        });
        Cookie.set("rol", sesion.data.rol_name,{
            expires: 1,
            secure: true,
            sameSite: 'strict',
        })
        // save('id', sesion,external);
        save('user', sesion.data.user);
        save('rol', sesion.data.rol_name);
        save('external', sesion.data.id);
        save('userInformation', sesionUser );
    }
    return(sesion);
}