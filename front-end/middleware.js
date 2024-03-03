import { NextResponse } from "next/server";

export function middleware(request){
    var token = request.cookies.get('my-token');
    var rolName = request.cookies.get('rol');
    //VENDEDOR
    if(request.nextUrl.pathname.includes('/autoDespachados')){
        console.log('Validando autos vendidos');
        if(token === undefined || rolName.value !== "vendedor" ){
            return NextResponse.redirect(new URL('/', request.url ));
        }
    }
    if(request.nextUrl.pathname.includes('/venta')){
        if(token === undefined || rolName.value !== "vendedor" ){
            return NextResponse.redirect(new URL('/', request.url ));
        }
    }
    if(request.nextUrl.pathname.includes('/venta')){
        if(token === undefined || rolName.value !== "vendedor" ){
            return NextResponse.redirect(new URL('/', request.url ));
        }
    }
    if(request.nextUrl.pathname.includes('/user')){
        if(token === undefined || rolName.value !== "vendedor" ){
            return NextResponse.redirect(new URL('/', request.url ));
        }
    }

    //ADMIN
    if(request.nextUrl.pathname.includes('/bodega')){
        if(token === undefined || rolName.value !== "gerente" ){
            return NextResponse.redirect(new URL('/inicio_sesion', request.url ));
        }
    }
    if(request.nextUrl.pathname.includes('/existencia')){
        if(token === undefined || rolName.value !== "gerente" ){
            return NextResponse.redirect(new URL('/', request.url ));
        }
    }
    if(request.nextUrl.pathname.includes('/existencia/editarExistencia/:external')){
        if(token === undefined || rolName.value !== "gerente" ){
            return NextResponse.redirect(new URL('/', request.url ));
        }
    }
    if(request.nextUrl.pathname.includes('/autos')){
        if(token === undefined || rolName.value !== "gerente" ){
            return NextResponse.redirect(new URL('/', request.url ));
        }
    }
    if(request.nextUrl.pathname.includes('/autos/editarAuto/:external')){
        if(token === undefined || rolName.value !== "gerente" ){
            return NextResponse.redirect(new URL('/', request.url ));
        }
    }
    if(request.nextUrl.pathname.includes('/autos/crearAuto')){
        if(token === undefined || rolName.value !== "gerente" ){
            return NextResponse.redirect(new URL('/', request.url ));
        }
    }
    return NextResponse.next();
}